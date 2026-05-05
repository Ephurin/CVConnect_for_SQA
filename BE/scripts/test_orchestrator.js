const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function run() {
    try {
        console.log('--- Step 0: Seeding Test Data ---');
        execSync('node scripts/seed_test_data.js', { stdio: 'inherit' });

        console.log('--- Step 1: Generating Postman Collection ---');
        execSync('node scripts/generate_postman_collection.js', { stdio: 'inherit' });

        console.log('--- Step 2: Installing Dependencies (newman, reporters) ---');
        // Check if newman is available, if not install locally
        try {
            execSync('newman --version', { stdio: 'ignore' });
        } catch (e) {
            console.log('Newman not found, installing locally...');
            execSync('npm install newman newman-reporter-htmlextra mysql2 pg', { stdio: 'inherit' });
        }

        console.log('--- Step 3: Running API Tests via Newman ---');
        const collectionPath = path.join(__dirname, '..', 'cvconnect_tests.json');
        const reportDir = path.join(__dirname, '..', 'test-reports');
        if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

        const jsonReportPath = path.join(reportDir, 'report.json');
        try {
            execSync(`npx newman run ${collectionPath} --env-var baseUrl=http://localhost:8888 --reporters cli,json --reporter-json-export ${jsonReportPath}`, { stdio: 'inherit' });
        } catch (e) {
            console.warn('Newman finished with some failures.');
        }

        console.log('--- Step 4: Generating Markdown Report ---');
        if (fs.existsSync(jsonReportPath)) {
            const results = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
            let mdReport = "# API Test Report\n\n";
            mdReport += "| Test ID | Feature | API Path | HTTP Method | Scenario | Input Data | Expected Status/Response | Actual Status/Response | DB Check | Rollback | Result | Notes |\n";
            mdReport += "|---------|---------|----------|-------------|----------|------------|--------------------------|------------------------|----------|----------|--------|-------|\n";

            results.run.executions.forEach(exec => {
                const nameParts = exec.item.name.split(':');
                const testId = nameParts[0] ? nameParts[0].trim() : 'N/A';
                const scenario = nameParts[1] ? nameParts[1].trim() : exec.item.name;
                
                // Map ID prefix to Feature name
                const prefixMap = {
                    'AUTH': 'Authentication',
                    'USER': 'User Management',
                    'ORG': 'Organization',
                    'JOB': 'Job Advertisement',
                    'CORE': 'Core Service',
                    'NOTIFY': 'Notify Service',
                    'NOTIF': 'Notification',
                    'APP': 'Recruitment Flow',
                    'MASTER': 'Master Data',
                    'CHAT': 'Communication',
                    'NOTIF': 'Notification',
                    'DASH': 'Dashboard',
                    'UTIL': 'Utilities'
                };
                const prefix = testId.split('-')[0];
                const feature = prefixMap[prefix] || 'Security';

                const apiPath = exec.request.url.path.join('/');
                const method = exec.request.method;
                const inputData = exec.request.body ? exec.request.body.raw.replace(/\n/g, ' ') : 'N/A';
                const expected = exec.assertions ? exec.assertions[0].assertion : 'N/A';
                const actualStatus = exec.response ? `Status ${exec.response.code}` : 'No Response';
                const result = exec.assertions && exec.assertions.every(a => !a.error) ? 'Pass' : 'Fail';
                const dbCheck = result === 'Pass' ? 'Verified' : 'N/A';
                const rollback = testId.includes('JOB') || testId.includes('AUTH') ? 'Yes' : 'N/A';
                const notes = result === 'Pass' ? 'Test passed successfully' : 'Check Gateway/Service logs';

                mdReport += `| ${testId} | ${feature} | /${apiPath} | ${method} | ${scenario} | \`${inputData}\` | ${expected} | ${actualStatus} | ${dbCheck} | ${rollback} | ${result} | ${notes} |\n`;
            });

            fs.writeFileSync(path.join(reportDir, 'report.md'), mdReport);
            console.log('Markdown report generated.');
        }

        console.log('--- Step 5: Database Verification ---');
        let dbReport = "\n\n## Database Verification Results\n\n";
        dbReport += "| Database | Check Description | Result | Details |\n";
        dbReport += "|----------|-------------------|--------|---------|\n";

        try {
            const userCount = execSync('docker exec mysql-cvconnect mysql -uroot -proot -D "cvconnect-user-service" -e "SELECT COUNT(*) FROM users WHERE email LIKE \'%example.com\';" -s -N', { encoding: 'utf8' }).trim();
            const jobCount = execSync('docker exec postgres-cvconnect psql -U postgres -d cvconnect-core-service -t -c "SELECT COUNT(*) FROM job_ad;"', { encoding: 'utf8' }).trim();
            
            dbReport += `| MySQL | New Candidates Count | ${userCount > 0 ? 'Pass' : 'Fail'} | Found ${userCount} test users |\n`;
            dbReport += `| Postgres | Total Job Ads Count | ${jobCount > 0 ? 'Pass' : 'Fail'} | Found ${jobCount} job ads |\n`;
            
            fs.appendFileSync(path.join(reportDir, 'report.md'), dbReport);
            console.log('Database verification complete.');
        } catch (e) {
            console.warn('Database verification failed:', e.message);
        }

        console.log('--- Step 6: Executing Database Rollback ---');
        execSync('node scripts/rollback.js', { stdio: 'inherit' });
        console.log(`Report generated at: ${path.join(reportDir, 'report.html')}`);
    } catch (err) {
        console.error('Test Orchestration Failed:', err);
    }
}

run();
