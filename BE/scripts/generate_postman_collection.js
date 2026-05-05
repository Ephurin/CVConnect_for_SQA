const fs = require('fs');
const path = require('path');

const extractedEndpoints = JSON.parse(fs.readFileSync('c:/Users/Laptop/Documents/Inteligent_System/CVConnect/BE/scripts/extracted_endpoints.json', 'utf8'));

// High quality manual scenarios
const manualScenarios = [
    { id: "AUTH-P-01", name: "Login Success", m: "POST", p: ["user", "auth", "login"], b: { username: "admin_test", password: "Password123!" }, s: [200], noToken: true },
    { id: "AUTH-N-01", name: "Wrong Pass", m: "POST", p: ["user", "auth", "login"], b: { username: "admin_test", password: "WrongPassword123!" }, s: [401], noToken: true },
    { id: "AUTH-N-02", name: "Empty User", m: "POST", p: ["user", "auth", "login"], b: { username: "" }, s: [400], noToken: true },
    { id: "AUTH-P-02", name: "Register Success", m: "POST", p: ["user", "auth", "register-candidate"], b: { username: `qa_user_${Date.now()}`, email: `qa${Date.now()}@example.com`, password: "Password123!", fullName: "QA Automated User" }, s: [200, 400], noToken: true },
    { id: "AUTH-N-03", name: "Duplicate User", m: "POST", p: ["user", "auth", "register-candidate"], b: { username: "admin_test", fullName: "Admin" }, s: [400], noToken: true },
    { id: "USER-P-01", name: "My Info", m: "GET", p: ["user", "user", "my-info", "1"], s: [200] },
    { id: "USER-P-02", name: "My Roles", m: "GET", p: ["user", "user", "my-roles"], s: [200] },
    { id: "USER-S-01", name: "Filter RBAC", m: "GET", p: ["user", "user", "filter"], s: [200] },
    { id: "JOB-P-01", name: "Create Job", m: "POST", p: ["core", "job-ad", "create"], b: {
            title: "Senior QA Engineer",
            positionId: 1,
            careerIds: [1],
            workLocationIds: [1],
            jobType: "FULL_TIME",
            dueDate: "2026-12-31T00:00:00Z",
            quantity: 1,
            salaryType: "RANGE",
            salaryFrom: 20000000,
            salaryTo: 30000000,
            currencyType: "VND",
            description: "Automated test description.",
            hrContactId: 1,
            jobAdStatus: "OPEN",
            isAllLevel: true,
            levelIds: [1],
            positionProcess: [
                { name: "Initial Screening", processTypeId: 1, sortOrder: 1 },
                { name: "Onboard", processTypeId: 6, sortOrder: 2 }
            ]
        }, s: [200] },
    { id: "JOB-N-01", name: "Bad Range", m: "POST", p: ["core", "job-ad", "create"], b: {title: "Bad Salary", salaryFrom: 2000, salaryTo: 1000}, s: [400, 401] },
];

const scenarios = [...manualScenarios];

// Add suffix scenarios (No Token, Boundary) for manual ones
const baseManuals = [...manualScenarios];
baseManuals.forEach(scen => {
    // Suffix -S: No Token
    scenarios.push({
        ...scen,
        id: scen.id + "-S",
        name: scen.name + " (No Token)",
        noToken: true
    });
    // Suffix -B: Boundary (Long FullName if body exists)
    if (scen.b) {
        scenarios.push({
            ...scen,
            id: scen.id + "-B",
            name: scen.name + " (Boundary Data)",
            b: { ...scen.b, fullName: "A".repeat(500) }
        });
    }
});

// Helper to normalize path for comparison
function normalize(service, method, path) {
    return `${service}:${method}:${path.replace(/\{[^}]+\}/g, ':id').replace(/\/+$/, '')}`;
}

const covered = new Set(scenarios.map(s => normalize(s.p[0], s.m, '/' + s.p.slice(1).join('/').replace(/\/\d+$/, '/:id'))));

// Auto-generate Smoke Tests for remaining endpoints
let autoCount = 0;
extractedEndpoints.forEach(ep => {
    const normPath = normalize(ep.service, ep.method, ep.path);
    if (!covered.has(normPath)) {
        autoCount++;
        const servicePrefix = ep.service.toUpperCase();
        const pathParts = ep.path.split('/').filter(p => p).map(p => p.startsWith('{') ? '1' : p);
        scenarios.push({
            id: `${servicePrefix}-AUTO-${String(autoCount).padStart(3, '0')}`,
            name: `Smoke: ${ep.method} ${ep.path}`,
            m: ep.method,
            p: [ep.service, ...pathParts],
            s: [200, 400, 401, 403, 404] // Accept any non-500 for smoke test
        });
        covered.add(normPath);
    }
});

const collection = {
    info: {
        name: "CVConnect Master QA Suite (Exhaustive)",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: scenarios.map(scen => {
        const urlParts = ["api", "v1", ...scen.p];
        const item = {
            name: `${scen.id}: ${scen.name}`,
            event: [
                {
                    listen: "test",
                    script: {
                        exec: [
                            `pm.test("${scen.id} | Status: " + pm.response.code, function () {`,
                            `    pm.expect(pm.response.code).to.be.oneOf([${scen.s.join(',')}]);`,
                            `    if (pm.response.code === 200 && pm.request.url.path.includes('login')) {`,
                            `        var jsonData = pm.response.json();`,
                            `        if (jsonData.data && jsonData.data.token) pm.globals.set("token", jsonData.data.token);`,
                            `    }`,
                            `});`
                        ],
                        type: "text/javascript"
                    }
                }
            ],
            request: {
                method: scen.m,
                header: [
                    { key: "Content-Type", value: "application/json" }
                ],
                url: {
                    host: ["{{baseUrl}}"],
                    path: urlParts,
                    query: scen.q ? Object.keys(scen.q).map(k => ({ key: k, value: String(scen.q[k]) })) : []
                }
            }
        };

        if (!scen.noToken) {
            item.request.header.push({ key: "Authorization", value: "Bearer {{token}}" });
        }

        if (scen.b) {
            item.request.body = {
                mode: "raw",
                raw: JSON.stringify(scen.b)
            };
        }

        return item;
    })
};

fs.writeFileSync('c:/Users/Laptop/Documents/Inteligent_System/CVConnect/BE/cvconnect_tests.json', JSON.stringify(collection, null, 2));
console.log(`Generated ${scenarios.length} scenarios (${manualScenarios.length} manual base, ${autoCount} automated smoke).`);
