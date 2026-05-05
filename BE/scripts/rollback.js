const mysql = require('mysql2/promise');
const { Client } = require('pg');

async function rollback() {
    console.log('--- QA Automated Cleanup Started ---');

    // MySQL Cleanup
    try {
        const mysqlConn = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'cvconnect-user-service'
        });
        const [userResult] = await mysqlConn.execute("DELETE FROM users WHERE username LIKE 'QA_USER_%' OR email LIKE '%@automated-test.com'");
        console.log(`MySQL: Deleted ${userResult.affectedRows} test user records.`);
        await mysqlConn.end();
    } catch (e) { console.error('MySQL Cleanup Failed:', e.message); }

    // Postgres Cleanup
    try {
        const pgClient = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'password',
            database: 'cvconnect-core-service'
        });
        await pgClient.connect();
        
        // Delete job ads
        const jobResult = await pgClient.query("DELETE FROM job_ad WHERE title LIKE 'QA_JOB_%' OR title = 'Bad Salary'");
        console.log(`Postgres: Deleted ${jobResult.rowCount} test job advertisement records.`);
        
        // Delete applications
        const appResult = await pgClient.query("DELETE FROM candidate_info_apply WHERE created_by LIKE 'QA_USER_%'");
        console.log(`Postgres: Deleted ${appResult.rowCount} candidate applications.`);

        await pgClient.end();
    } catch (e) { console.error('Postgres Cleanup Failed:', e.message); }

    console.log('--- QA Automated Cleanup Finished ---');
}

rollback();
