const fs = require('fs');
const path = require('path');
const log  = require('../Other/logs.js');

const WATCHED_FOLDERS = ['Commands/Slash', 'Commands/Prefix', 'Components'];

function clearRequireCache(filePath) {
    delete require.cache[require.resolve(filePath)];
}

function Debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function loadCommand(client, filePath) {
    try {
        clearRequireCache(filePath);
        const command = require(filePath);
        const commandData = command.data.toJSON();
        client.commands.set(commandData.name, command);
        log.HR(`Reloaded command: ${commandData.name}`);
        if (command.alias) {
            command.alias.forEach(alias => {
                client.commands.set(alias, command);
                log.HR(`Reloaded alias: ${alias} for command: ${commandData.name}`);
            });
        }
    } catch (error) {
        log.error(`Failed to load command at ${filePath}: ${error.message}`);
    }
}

function loadComponent(client, filePath) {
    try {
        if (!client.components) {
            client.components = new Map();
            log.HR('Initialized components map');
        }

        clearRequireCache(filePath);
        const component = require(filePath);
        
        if (!component.customId || !component.execute) {
            log.warn(`Invalid component at ${filePath}`);
            return;
        }

        const type = filePath.split(path.sep).slice(-2)[0];

        if (!client.components.has(type)) {
            client.components.set(type, new Map());
            log.HR(`Initialized new component type: ${type}`);
        }

        const typeMap = client.components.get(type);
        typeMap.set(component.customId, component);

        log.HR(`Reloaded component: ${component.customId}`);
    } catch (error) {
        log.error(`Failed to load component at ${filePath}: ${error.message}`);
    }
}

function loadPrefixCommand(client, filePath) {
    try {
        clearRequireCache(filePath);
        const prefixCommand = require(filePath);

        if ('command' in prefixCommand && 'execute' in prefixCommand) {
            client.prefix.set(prefixCommand.command, prefixCommand);
            
            if (prefixCommand.aliases) {
                prefixCommand.aliases.forEach(alias => {
                    client.prefix.set(alias, prefixCommand);
                    log.log(`Reloaded alias: ${alias} for command: ${prefixCommand.command}`);
                });
            }
            
            log.HR(`Reloaded prefix command: ${prefixCommand.command}`);
        }
    } catch (error) {
        log.error(`Failed to load prefix command at ${filePath}: ${error.message}`);
    }
} 



function EditCallback(client, folder, eventType, filename) {
    if (!filename) return;
    
    const fullPath = path.join(__dirname, '..', folder, filename);
    
    if (!fs.existsSync(fullPath)) {
        log.warn(`File deleted: ${filename}`);
        return;
    }

    if (!filename.endsWith('.js')) return;

    try {
        if (folder.includes('Commands/Slash')) {
            loadCommand(client, fullPath);
        } else if (folder.includes('Components')) {
            loadComponent(client, fullPath);
        } else if (folder.includes('Commands/Prefix')) {
            loadPrefixCommand(client, fullPath);
        }
    } catch (error) {
        log.warn(`Error processing ${filename}: ${error.message}`);
    }
}

module.exports = function initHotReload(client) {
    for (const folder of WATCHED_FOLDERS) {
        const watchPath = path.join(__dirname, '..', folder);
        
        if (!fs.existsSync(watchPath)) {
            log.warn(`Folder does not exist: ${folder}`);
            continue;
        }

        log.HR(`Watching folder: ${folder}`);
        const callback = EditCallback.bind(null, client, folder);
        fs.watch(watchPath, { recursive: true }, Debounce(callback, 500));
    }
    
    log.HR('Hot Reload System Initialized');
};

function watchFile(client, filePath) {
    const folder = path.dirname(filePath).split(path.sep).pop()

    if (folder === 'Slash') {
        loadCommand(client, filePath);
    } else if (folder === 'Components') {
        loadComponent(client, filePath);
    } else if (folder === 'Prefix') {
        loadPrefixCommand(client, filePath);
    }
}