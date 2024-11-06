module.exports = {
    customId: 'menus',
    async execute(interaction, client) {

        const selected = interaction.values[0]

        const embed = {
            title: 'Option One has been clicked'
        }

        const embed1 = {
            title: 'Option Two has been clicked'
        }

        if (selected === 'option1') {

            interaction.reply({ embeds: [embed], ephemeral: true})
            
        } else if (selected === 'option2') {

                interaction.reply({ embeds: [embed1], ephemeral: true})

        }
    }
}