module.exports = {
    customId: 'poke',
    async execute(interaction, client) {
        await interaction.reply({ content: 'Ouch that hurts!!!', ephemeral: true})
    }
}