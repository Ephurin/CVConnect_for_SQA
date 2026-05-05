const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/Laptop/Documents/Inteligent_System/CVConnect/BE';
const services = ['user-service', 'core-service', 'notify-service'];

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (file.endsWith('Controller.java')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const allEndpoints = [];

services.forEach(service => {
    const srcDir = path.join(baseDir, service, 'src/main/java');
    if (!fs.existsSync(srcDir)) return;

    const controllerFiles = getFiles(srcDir);

    controllerFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        // Find class level RequestMapping
        const classMappingMatch = content.match(/@RequestMapping\("([^"]+)"\)/);
        const classPrefix = classMappingMatch ? classMappingMatch[1] : '';

        // Find methods
        const methods = [
            { annotation: 'GetMapping', method: 'GET' },
            { annotation: 'PostMapping', method: 'POST' },
            { annotation: 'PutMapping', method: 'PUT' },
            { annotation: 'DeleteMapping', method: 'DELETE' },
            { annotation: 'PatchMapping', method: 'PATCH' }
        ];

        methods.forEach(({ annotation, method }) => {
            const regex = new RegExp(`@${annotation}\\("([^"]*)"\\)`, 'g');
            let match;
            while ((match = regex.exec(content)) !== null) {
                let endpointPath = match[1];
                // Handle path variables like {id} -> :id
                let fullPath = `${classPrefix}${endpointPath}`.replace(/\/+/g, '/');
                if (!fullPath.startsWith('/')) fullPath = '/' + fullPath;
                
                allEndpoints.push({
                    service: service.replace('-service', ''),
                    method: method,
                    path: fullPath,
                    file: path.basename(file)
                });
            }

            // Handle mappings without explicit path @GetMapping
            const regexEmpty = new RegExp(`@${annotation}\\s*\\n\\s*public`, 'g');
            let matchEmpty;
            while ((matchEmpty = regexEmpty.exec(content)) !== null) {
                let fullPath = classPrefix;
                if (!fullPath.startsWith('/')) fullPath = '/' + fullPath;
                allEndpoints.push({
                    service: service.replace('-service', ''),
                    method: method,
                    path: fullPath,
                    file: path.basename(file)
                });
            }
        });
    });
});

fs.writeFileSync(path.join(baseDir, 'scripts/extracted_endpoints.json'), JSON.stringify(allEndpoints, null, 2));
console.log(`Extracted ${allEndpoints.length} endpoints.`);
