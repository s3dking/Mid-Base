const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poke')
    .setDescription('poke the button'),
    async execute(interaction, client) {

        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    custom_id: 'poke',
                    style: '1',
                    link: 'https://google.com',
                    label: 'Poke',
                    emoji: '👆'
                }
            ]
        }


        await interaction.reply({ content: 'Poke me!', components: [button]})
    }
}