const fs = require('fs');
const path = require('path');
const log  = require('../logs.js');
const EventLoader = require('../../Handlers/EventHandling.js');

const WATCHED_FOLDERS = ['Commands/Slash', 'Commands/Prefix', 'Components', 'Events', 'Commands/Context'];

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

function hasCommandChanged(oldCommand, newCommand) {
    if (!oldCommand || !newCommand) return false;
    
    const oldData = oldCommand.data?.toJSON?.() || oldCommand.data;
    const newData = newCommand.data?.toJSON?.() || newCommand.data;
    
    if (!oldData || !newData) return false;
    
    return oldData.name !== newData.name || 
           oldData.description !== newData.description ||
           oldData.type !== newData.type;  // Add check for type changes
}

async function reregisterSlashCommands(client) {
    try {
        client.commands.clear();
        client.devCommands.clear();
        await require('../../Handlers/SlashHandling.js')(client, true);
        log.HR('Re-registered slash commands');
    } catch (error) {
        log.error(`Failed to re-register slash commands: ${error.message}`);
    }
}

async function reregisterContextCommands(client) {
    try {
        client.context.clear();
        client.devContext.clear();
        await require('../../Handlers/ContextHandling.js')(client, true);
        log.HR('Re-registered context commands');
    } catch (error) {
        log.error(`Failed to re-register context commands: ${error.message}`);
    }
}

function loadCommand(client, filePath) {
    try {
        const command = require(filePath);
        const commandName = command.data?.toJSON?.()?.name || command.data?.name;
        const oldCommand = client.commands.get(commandName);

        clearRequireCache(filePath);
        const newCommand = require(filePath);
        
        if (hasCommandChanged(oldCommand, newCommand)) {
            reregisterSlashCommands(client);
        } else {
            // Just update the command in memory
            const commandData = newCommand.data?.toJSON?.() || newCommand.data;
            client.commands.set(commandData.name, newCommand);
            if (newCommand.alias) {
                newCommand.alias.forEach(alias => {
                    client.commands.set(alias, newCommand);
                });
            }
            log.HR(`Reloaded Slash: ${commandData.name}`);
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
        }

        const typeMap = client.components.get(type);
        typeMap.set(component.customId, component);

        log.HR(`Reloaded Component: ${component.customId} ( ${type} )`);
    } catch (error) {
        log.error(`Failed to load component at ${filePath}: ${error.message}`);
    }
}

function loadPrefixCommand(client, filePath) {
    try {
        clearRequireCache(filePath);
        const prefixCommand = require(filePath);

        if ('name' in prefixCommand && 'execute' in prefixCommand) {
            client.prefix.set(prefixCommand.name, prefixCommand);
            
            if (prefixCommand.alias) {
                prefixCommand.alias.forEach(alias => {
                    client.prefix.set(alias, prefixCommand);
                });
            }
            
            log.HR(`Reloaded Prefix Command: ${prefixCommand.name}`);
        }
    } catch (error) {
        log.error(`Failed to load prefix command at ${filePath}: ${error.message}`);
    }
}

function loadContextCommand(client, filePath) {
    try {
        const contextCommand = require(filePath);
        const commandName = contextCommand.data?.toJSON?.()?.name;
        const oldCommand = client.context.get(commandName) || client.devContext.get(commandName);

        clearRequireCache(filePath);
        const newCommand = require(filePath);
        
        if (hasCommandChanged(oldCommand, newCommand)) {
            reregisterContextCommands(client);
        } else {
            // Just update the command in memory
            const commandData = newCommand.data.toJSON();
            if (newCommand.dev) {
                client.devContext.delete(commandData.name); // Clear old command first
                client.devContext.set(commandData.name, newCommand);
            } else {
                client.context.delete(commandData.name); // Clear old command first
                client.context.set(commandData.name, newCommand);
            }
            log.HR(`Reloaded Context: ${commandData.name}`);
        }
    } catch (error) {
        log.error(`Failed to load context command at ${filePath}: ${error.message}`);
    }
}

function loadEvents(client, filePath) {
    clearRequireCache(filePath);
    const event = require(filePath)
    client.removeAllListeners();
    EventLoader(client);
    client.logs.HR(`Reloaded Event: ${event.event}`)
}


function EditCallback(client, folder, eventType, filename) {
    if (!filename) return;
    
    const fullPath = path.join(__dirname, '..', '..', folder, filename);
    
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
        } else if (folder.includes('Events')) {
            loadEvents(client, fullPath);
        } else if (folder.includes('Commands/Context')) {
            loadContextCommand(client, fullPath);
        }
    } catch (error) {
        log.warn(`Error processing ${filename}: ${error.message}`);
    }
}

module.exports = function initHotReload(client) {
    for (const folder of WATCHED_FOLDERS) {
        const watchPath = path.join(__dirname, '..', '..', folder);
        
        if (!fs.existsSync(watchPath)) {
            log.warn(`Folder does not exist: ${folder}`);
            continue;
        }

        //log.HR(`Watching folder: ${folder}`);
        const callback = EditCallback.bind(null, client, folder);
        try {
            fs.watch(watchPath, { recursive: true }, Debounce(callback, 500));
        } catch (error) {
            log.error(`Failed to watch folder ${folder}: ${error.message}`);
        }
    }
    
    log.HR(`Reloadable Folder Count: ${client.logs.colors.grey}${WATCHED_FOLDERS.length}`);
};