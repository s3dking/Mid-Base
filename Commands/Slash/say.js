const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something'),
    async execute(interaction, client) {

        const modal = {
            title: 'Say Something!',
            custom_id: 'say',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            label: 'Enter Text Here!',
                            custom_id: 'txt',
                            style: 1
                        }
                    ]
                }
            ]
        }

        await interaction.showModal(modal)
    }
}