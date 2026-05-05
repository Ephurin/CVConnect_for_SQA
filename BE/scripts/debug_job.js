const http = require('http');

function post(url, data, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const body = JSON.stringify(data);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(resData);
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
                    else reject({ status: res.statusCode, data: parsed });
                } catch (e) {
                    reject({ status: res.statusCode, data: resData });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
    });
}

async function debug() {
    try {
        const loginRes = await post('http://localhost:8888/api/v1/user/auth/login', {
            username: "admin_test",
            password: "Password123!"
        });
        const token = loginRes.data.token;
        console.log('Login Success. Token length:', token.length);

        const jobRes = await post('http://localhost:8888/api/v1/core/job-ad/create', {
            title: "Senior QA Engineer",
            positionId: 1,
            careerIds: [1],
            workLocationIds: [1],
            jobType: "FULL_TIME",
            dueDate: Date.now() + 86400000,
            quantity: 1,
            salaryType: "RANGE",
            salaryFrom: 2000,
            salaryTo: 3000,
            currencyType: "USD",
            description: "Automated test description.",
            hrContactId: 1,
            jobAdStatus: "PUBLISHED",
            isAllLevel: true,
            levelIds: [1],
            positionProcess: [
                { name: "Initial Screening", processTypeId: 1, sortOrder: 1 }
            ]
        }, { Authorization: `Bearer ${token}` });
        console.log('Job Creation Success:', jobRes);
    } catch (e) {
        if (e.status) {
            console.error('API Error:', e.status, JSON.stringify(e.data, null, 2));
        } else {
            console.error('Error:', e.message);
        }
    }
}

debug();
