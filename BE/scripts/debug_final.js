const http = require('http');

const loginData = JSON.stringify({
    username: 'admin_test',
    password: 'Password123!'
});

const loginOptions = {
    hostname: 'localhost',
    port: 8888,
    path: '/api/v1/user/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const req = http.request(loginOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        const token = JSON.parse(body).data.token;
        console.log('Token obtained.');

        const testOptions = {
            hostname: 'localhost',
            port: 8888,
            path: '/api/v1/core/job-ad/create',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const testData = JSON.stringify({
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
                { name: "Initial Screening", processTypeId: 1, sortOrder: 1 }
            ]
        });

        const testReq = http.request(testOptions, (testRes) => {
            console.log(`Status: ${testRes.statusCode}`);
            let testBody = '';
            testRes.on('data', (chunk) => testBody += chunk);
            testRes.on('end', () => {
                console.log('Response:', testBody);
            });
        });

        testReq.write(testData);
        testReq.end();
    });
});

req.write(loginData);
req.end();
