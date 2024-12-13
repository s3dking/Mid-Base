const { REST, Routes, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async function (client, silent = false) {
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    const console = require('../Utils/logs.js');
    const commands = [];
    const devCommands = [];

    const slashCommandPath = path.join(__dirname, '../Commands/Slash');
    client.commands = new Map();
    client.devCommands = new Map();

    const commandFolder = fs.readdirSync(slashCommandPath).filter(f => f.endsWith('.js'));
    if (!silent) console.slash(`Command Count: ${client.logs.colors.grey}${commandFolder.length}`);

    try {
        for (const file of commandFolder) {
            const filePath = path.join(slashCommandPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                let commandData;
                if (typeof command.data === 'object' && !Array.isArray(command.data)) {
                    commandData = command.data;
                } else {
                    commandData = command.data.toJSON();
                }

                // Handle dev commands separately
                if (command.dev === true) {
                    client.devCommands.set(commandData.name, command);
                    devCommands.push(commandData);

                    // Handle dev command aliases
                    if (command.alias && Array.isArray(command.alias)) {
                        for (const alias of command.alias) {
                            const aliasData = {
                                ...commandData,
                                name: alias
                            };
                            devCommands.push(aliasData);
                            client.devCommands.set(alias, {
                                data: aliasData,
                                execute: command.execute,
                                originalCommand: commandData.name
                            });
                        }
                    }
                    continue;
                }

                // Handle regular commands
                client.commands.set(commandData.name, command);
                commands.push(commandData);

                if (command.alias && Array.isArray(command.alias)) {
                    for (const alias of command.alias) {
                        const aliasData = {
                            ...commandData,
                            name: alias
                        };
                        
                        commands.push(aliasData);
                        
                        client.commands.set(alias, {
                            data: aliasData,
                            execute: command.execute,
                            originalCommand: commandData.name
                        });
                    }
                }
            }
        }

        // Register regular commands
        if (client.application) {
            await rest.put(
                Routes.applicationCommands(client.application.id),
                { body: commands }
            );

            // Register dev commands if dev guild ID is provided
            if (client.config.devguildID && devCommands.length > 0) {
                await rest.put(
                    Routes.applicationGuildCommands(client.application.id, client.config.devguildID),
                    { body: devCommands }
                );
            }
        } else {
            // If client.application isn't available yet, wait for ready event
            client.once('ready', async () => {
                await rest.put(
                    Routes.applicationCommands(client.application.id),
                    { body: commands }
                );

                if (client.config.devguildID && devCommands.length > 0) {
                    await rest.put(
                        Routes.applicationGuildCommands(client.application.id, client.config.devguildID),
                        { body: devCommands }
                    );
                }
            });
        }
    } catch (err) {
        console.error('Error registering commands:' + err);
    }
}