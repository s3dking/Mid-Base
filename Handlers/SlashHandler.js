const { REST, Routes, Events, Collection } = require('discord.js');
require('dotenv').config();
const { ClientID, Token } = require('../config.json')
const fs = require('node:fs');
const path = require('node:path');

module.exports = function (client) {
    const console = require('../Utils/logs.js');
    const commands = [];

    const slashCommandPath = path.join(__dirname, '../Commands/Slash');

    client.commands = new Map();

    const commandFolder = fs.readdirSync(slashCommandPath).filter(f => f.endsWith('.js'));

    try {
    for (const file of commandFolder) {
        const filePath = path.join(slashCommandPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            const commandData = command.data.toJSON();
            const cmds = commandData.name;
            client.commands.set(commandData.name, command);
            commands.push(commandData);
            console.success(`[ SLASH ] Loaded: ${cmds}`);
        }
    }

} catch (err) {
    console.error(err)
}
    const rest = new REST({ version: '10' }).setToken(Token);

    (async () => {
        try {

            await rest.put(
                Routes.applicationCommands(ClientID),
                { body: commands }
            );
            console.success(`[ SLASH ] Loaded: ${commands.length} file(s)`)

            console.success('[ SLASH ] Refreshed Commands Succesfully');
        } catch (error) {
            console.error('Error reloading application (/) commands:', error);
        }
    })();

    client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		if(command.execute) {
			console.log(`[ SLASH ] /${interaction.commandName} has been executed by ${interaction.user.tag}`)
		}
	});
};