const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
    
    module.exports = {
        data: new ContextMenuCommandBuilder()
            .setName('Repeat')
            .setType(ApplicationCommandType.Message),
        async execute(interaction, client) {
            const message = interaction.targetMessage;
            const contents = message.content

            await interaction.reply({ content: contents });
        },
    };
    