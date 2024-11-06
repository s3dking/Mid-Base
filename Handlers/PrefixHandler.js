const path = require('node:path')
const fs = require('node:fs')
const { Collection } = require('discord.js')
const { prefix } = require('../config.json')

module.exports = function (client) {
    const console = require('../Utils/logs.js');

    const prefixFolder = fs.readdirSync('Commands/Prefix').filter((f) => f.endsWith('.js'));

    client.prefix = new Collection();

    for (arx of prefixFolder) {
		const Cmd = require('../Commands/Prefix/' + arx)
		client.prefix.set(Cmd.name, Cmd)
	}

    for (const file of prefixFolder) {
        const filePath = path.join('../Commands/Prefix', file);
        const prefixCommand = require(filePath);
		console.success(`[ PREFIX ] Loaded: ${prefixFolder.length} file(s)`)

        if ('name' in prefixCommand && 'execute' in prefixCommand) {
            const cmdName = prefixCommand.name;
            console.success(`[ PREFIX ] Loaded: ${cmdName}`);
        }
    }

    client.on('messageCreate', async message => {;
		if (!message.content.startsWith(prefix) || message.author.bot) return;
	
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
	
		const command = client.prefix.get(commandName);
	
		if (!command) return;
	
		try {
			await command.execute(message, args);
		} catch (error) {
			console.error(error);
			await message.reply('There was an error executing that command!');
		}
		if(command.execute) {
			console.log(`[ PREFIX ] ${prefix}${commandName} has been executed by ${message.author.tag}`)
		}
	});
}