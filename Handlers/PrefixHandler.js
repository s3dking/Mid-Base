const path = require('node:path')
const fs = require('node:fs')
const { Collection } = require('discord.js')
const { prefix } = require('../config.json')

module.exports = function (client) {
    const console = require('../Other/logs.js');

    const prefixFolder = fs.readdirSync('Commands/Prefix').filter((f) => f.endsWith('.js'));

    client.prefix = new Map();
    client.command = new Map();

    for (const arx of prefixFolder) {
        const Cmd = require('../Commands/Prefix/' + arx)
        client.prefix.set(Cmd.command, Cmd)
    }

    for (const file of prefixFolder) {
        const filePath = path.join('../Commands/Prefix', file);
        const prefixCommand = require(filePath);
        console.prefix(`Loaded: ${prefixFolder.length} file(s)`)

        if ('command' in prefixCommand && 'execute' in prefixCommand) {
            const cmdName = prefixCommand.command;
            console.prefix(`Loaded: ${cmdName}`);

            if (prefixCommand.alias && prefixCommand.alias.length) {
                for (const alias of prefixCommand.alias) {

                    if (client.command.has(alias)) {
                        client.logs.warn(`The alias "${alias}" for the prefix command "${cmdName}" is already loaded.`);
                    } else {
                        client.command.set(alias, prefixCommand);
                        client.logs.prefix(`Alias: ${alias}`);
                    }
                }
            }
        } else {
            console.error(`Command at ${filePath} is missing required properties.`);
        }
    }

    client.on('messageCreate', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        console.util(`Received command: ${commandName}`);

        const command = client.prefix.get(commandName) || client.command.get(commandName);

        if (!command) {
            console.warn(`Command not found: ${commandName}`); 
            return;
        }

        try {
            await command.execute(message, client);
            console.prefix(`${prefix}${commandName} has been executed by ${message.author.tag}`);
        } catch (error) {
            console.error(error);
            await message.reply('There was an error executing that command!');
        }
    });
}