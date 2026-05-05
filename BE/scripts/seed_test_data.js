const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function seedMySQL() {
    console.log('Seeding MySQL (User Service)...');
    const passwordHash = '$2a$10$4ix9iLrjxItWjuvS1JLT3uIB6sD6YSN5mY6..6uCZPE7fsbxsxYc.'; 
    
    const sql = `
        USE \`cvconnect-user-service\`;
        DELETE FROM role_user WHERE user_id IN (1, 2);
        DELETE FROM users WHERE id IN (1, 2);
        
        INSERT INTO users (id, username, password, email, full_name, access_method, is_email_verified, is_active) 
        VALUES (1, 'admin_test', '${passwordHash}', 'admin@example.com', 'Admin Test', 'LOCAL', 1, 1);
        INSERT INTO users (id, username, password, email, full_name, access_method, is_email_verified, is_active) 
        VALUES (2, 'candidate_test', '${passwordHash}', 'candidate@example.com', 'Candidate Test', 'LOCAL', 1, 1);
        
        INSERT IGNORE INTO role_user (user_id, role_id) VALUES (1, 1), (1, 3), (1, 4), (2, 2);
        
        -- Seed Permissions for ORG_JOB_AD
        INSERT IGNORE INTO role_menu (role_id, menu_id, permission) VALUES (3, 23, 'VIEW,ADD,UPDATE,DELETE,EXPORT');
        INSERT IGNORE INTO role_menu (role_id, menu_id, permission) VALUES (4, 23, 'VIEW,ADD,UPDATE,DELETE,EXPORT');
        
        -- Plural table name: org_members
        DELETE FROM org_members WHERE user_id = 1;
        INSERT INTO org_members (user_id, org_id, is_active) VALUES (1, 1, 1);
    `;
    
    try {
        const tempSql = path.join(__dirname, 'temp_seed.sql');
        fs.writeFileSync(tempSql, sql);
        execSync(`docker exec -i mysql-cvconnect mysql -uroot -proot < "${tempSql}"`, { stdio: 'inherit' });
        fs.unlinkSync(tempSql);
        console.log('MySQL Seeding Complete.');
    } catch (e) {
        console.error('MySQL Seeding Failed:', e.message);
    }
}

async function seedPostgres() {
    console.log('Seeding PostgreSQL (Core Service)...');
    const sql = `
        -- Master Data for Job (Correct Plural Names)
        INSERT INTO organization (id, name, website, is_active) VALUES (1, 'Test Org', 'https://testorg.com', true) ON CONFLICT (id) DO NOTHING;
        INSERT INTO department (id, code, name, org_id) VALUES (1, 'IT', 'IT Dept', 1) ON CONFLICT (id) DO NOTHING;
        INSERT INTO "position" (id, code, name, department_id) VALUES (1, 'DEV', 'Developer', 1) ON CONFLICT (id) DO NOTHING;
        
        -- Plural: careers
        INSERT INTO careers (id, code, name) VALUES (1, 'IT', 'Information Technology') ON CONFLICT (id) DO NOTHING;
        -- Singular: level
        INSERT INTO level (id, code, name) VALUES (1, 'SENIOR', 'Senior') ON CONFLICT (id) DO NOTHING;
        -- organization_address instead of work_location
        INSERT INTO organization_address (id, province, detail_address, org_id) VALUES (1, 'Hanoi', '123 Test St', 1) ON CONFLICT (id) DO NOTHING;
        -- process_type
        INSERT INTO process_type (id, code, name, sort_order, is_default) VALUES (1, 'CV_SCREEN', 'CV Screening', 1, true) ON CONFLICT (id) DO NOTHING;
        
        -- Reset Sequences
        SELECT setval('organization_id_seq', (SELECT COALESCE(MAX(id),1) FROM organization));
        SELECT setval('careers_id_seq', (SELECT COALESCE(MAX(id),1) FROM careers));
        SELECT setval('level_id_seq', (SELECT COALESCE(MAX(id),1) FROM level));
    `;
    try {
        const tempSql = path.join(__dirname, 'temp_seed_pg.sql');
        fs.writeFileSync(tempSql, sql);
        execSync(`docker exec -i postgres-cvconnect psql -U postgres -d cvconnect-core-service < "${tempSql}"`, { stdio: 'inherit' });
        fs.unlinkSync(tempSql);
        console.log('PostgreSQL Seeding Complete.');
    } catch (e) {
        console.error('PostgreSQL Seeding Failed:', e.message);
    }
}

async function clearRedis() {
    console.log('Clearing Redis Cache...');
    try {
        execSync('docker exec redis-cvconnect redis-cli FLUSHALL', { stdio: 'inherit' });
        console.log('Redis Cleared.');
    } catch (e) {
        console.warn('Redis Clear Failed (maybe not running):', e.message);
    }
}

async function run() {
    await seedMySQL();
    await seedPostgres();
    await clearRedis();
}

run();
