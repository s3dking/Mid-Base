const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
    
    module.exports = {
        data: new ContextMenuCommandBuilder()
            .setName('Avatar')
            .setType(ApplicationCommandType.User),
        async execute(interaction, client) {
            const user = interaction.targetUser;
            const avatar = user.displayAvatarURL({ size: 1024 });
            await interaction.reply({ content: `Here is ${user.username}'s avatar:`, files: [avatar] });
        },
    };
    