module.exports = {
    customId: 'apilatency',
    async execute(interaction, client) {
        const ping = Math.round(interaction.client.ws.ping)
        await interaction.reply({ content: `* API Latency \n    ** * ${ping}**`, ephemeral: true})
    }
}