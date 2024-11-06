const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('options')
    .setDescription('Options'),
    async execute(interaction, client) {
        /*const menu = new StringSelectMenuBuilder()
        .setCustomId('menus')
        .setPlaceholder('TESTING')
        .addOptions(
            {
                label: 'test',
                description: 'tst',
                value: 'opt'
            }
        );

        const row = new ActionRowBuilder()
        .addComponents(menu)*/

        const menu = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'menus',
                    options: [
                        {
                            label: 'Option One',
                            description: 'Option #1',
                            value: 'option1'
                        },
                        {
                            label: 'Option Two',
                            description: 'Option #2',
                            value: 'option2'
                        }
                    ],
                    placeholder: 'Options'
                }
            ]
        }

        await interaction.reply({ content: 'Press an option', components: [menu] })
    }
}