const fs = require('node:fs');
const path = require('node:path');

module.exports = function(client) {
    client.prefix = new Map();
    client.prefixDev = new Map(); // New map for dev commands

    const prefixPath = fs.readdirSync(path.join(__dirname, '../Commands/Prefix')).filter(f => f.endsWith('.js'));
    client.logs.prefix(`Command Count: ${client.logs.colors.grey}${prefixPath.length}`);

    for (const file of prefixPath) {
        var filePath = path.join(__dirname, '../Commands/Prefix', file);
        const PrefixCmd = require(filePath);

        if ('name' in PrefixCmd && 'execute' in PrefixCmd) {
            // Check if command is dev-only
            if (PrefixCmd.dev && PrefixCmd.dev === true) {
                client.prefixDev.set(PrefixCmd.name, PrefixCmd);
                
                // Handle aliases for dev commands
                if (PrefixCmd.alias && PrefixCmd.alias.length) {
                    for (const alias of PrefixCmd.alias) {
                        if (client.prefixDev.has(alias)) {
                            client.logs.warn(`The dev alias "${alias}" for the prefix command "${PrefixCmd.name}" is already loaded.`);
                        } else {
                            client.prefixDev.set(alias, PrefixCmd);
                        }
                    }
                }
                continue; // Skip adding to regular commands
            }

            // Regular commands
            client.prefix.set(PrefixCmd.name, PrefixCmd);

            if (PrefixCmd.alias && PrefixCmd.alias.length) {
                for (const alias of PrefixCmd.alias) {
                    if (client.prefix.has(alias)) {
                        client.logs.warn(`The alias "${alias}" for the prefix command "${PrefixCmd.name}" is already loaded.`);
                    } else {
                        client.prefix.set(alias, PrefixCmd);
                    }
                }
            }
        } else {
            client.logs.error(`You are missing either the execute or name property!!! ${filePath}`);
        }
    }
};