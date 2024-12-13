const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
    ignoredModules: [
        'fs', 'path', 'http', 'https', 'child_process', 'crypto', 'os', 
        'util', 'stream', 'events', 'buffer', 'querystring', 'url', 
        'assert', 'zlib', 'tty', 'net', 'dns', 'dgram', 'cluster'
    ],
    ignoredPaths: [
        'node_modules',
        '.git',
        'dist',
        'build'
    ],
    fileExtensions: ['.js', '.jsx', '.ts', '.tsx']
};

async function PackageChecker() {
    try {
        const packageJsonPath = path.join(__dirname, '../../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const installedDependencies = {
            ...packageJson.dependencies || {},
            ...packageJson.devDependencies || {}
        };

        const requiredPackages = new Set();
        
        function readFiles(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory() && !CONFIG.ignoredPaths.includes(file)) {
                    readFiles(filePath);
                    continue;
                }

                if (!CONFIG.fileExtensions.includes(path.extname(file))) {
                    continue;
                }

                const fileContent = fs.readFileSync(filePath, 'utf8');
                findRequiredPackages(fileContent);
            }
        }

        function findRequiredPackages(content) {
            const requireRegex = /require\(['"]([^./][^'"]+)['"]\)/g;
            const importRegex = /from ['"]([^'"]+)['"]/g;
            let match;

            [requireRegex, importRegex].forEach(regex => {
                while ((match = regex.exec(content))) {
                    const packageName = getPackageNameFromRequire(match[1]);
                    if (packageName && !CONFIG.ignoredModules.includes(packageName)) {
                        requiredPackages.add(packageName);
                    }
                }
            });
        }

        function getPackageNameFromRequire(requirePath) {
            const parts = requirePath.split('/');
            return requirePath.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
        }

        async function installMissingPackages() {
            const missingPackages = [...requiredPackages].filter(pkg => 
                !installedDependencies[pkg] && !CONFIG.ignoredModules.includes(pkg)
            );
        
            const results = {
                success: [],
                failed: []
            };
        
            for (const pkg of missingPackages) {
                try {
                    execSync(`npm install ${pkg} --no-fund --no-audit`, {
                        stdio: ['ignore', 'ignore', 'ignore'],
                        env: { ...process.env, NODE_NO_WARNINGS: '1' }
                    });
                    results.success.push(pkg);
                    console.log(`Installing package: ${pkg}`);
                } catch (error) {
                    results.failed.push(pkg);
                    console.log(`Failed to install ${pkg}`);
                }
            }
        
            if (missingPackages.length === 0) {
                console.log('No new packages to install');
            } else {
                console.log(`\nInstallation complete:`);
                console.log(`Successfully installed: ${results.success.length} packages`);
                if (results.failed.length > 0) {
                    console.log(`Failed to install: ${results.failed.join(', ')}`);
                }
            }
        
            return results;
        }
        
        readFiles(__dirname);
        const installResults = await installMissingPackages();
        
        return {
            required: [...requiredPackages],
            installed: Object.keys(installedDependencies),
            newlyInstalled: installResults.success,
            failed: installResults.failed
        };
    } catch (error) {
        console.log(`Error: ${error.message}`);
        throw error;
    }
}

module.exports = PackageChecker;