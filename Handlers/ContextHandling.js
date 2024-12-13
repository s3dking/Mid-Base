const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

module.exports = async function (client, silent = false) {
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    
    client.context = client.context || new Map();
    client.devContext = client.devContext || new Map();
    const commands = [];
    const devCommands = [];

    const contextPath = path.join(__dirname, '../Commands/Context');
    const contextCommands = fs.readdirSync(contextPath).filter(f => f.endsWith('.js'));
    if (!silent) client.logs.context(`Command Count: ${client.logs.colors.grey}${contextCommands.length}`);

    for (const file of contextCommands) {
        try {
            const filePath = path.join(contextPath, file);
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                const commandData = command.data.toJSON();
                
                if (command.dev && command.dev === true) {
                    client.devContext.set(commandData.name, command);
                    devCommands.push(commandData);
                } else {
                    client.context.set(commandData.name, command);
                    commands.push(commandData);
                }
            }
        } catch (error) {
            client.logs.error(`Error loading command ${file}: ${error}`);
        }
    }

    try {
        if (client.application) {
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
        } else {
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
        console.error('Error registering commands:', err);
    }
};