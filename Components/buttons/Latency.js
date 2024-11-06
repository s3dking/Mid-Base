module.exports = {
    customId: 'latency',
    async execute(interaction, client) {
        const ping = await interaction.reply({ content: 'Recieving the bots latency... ⏰', ephemeral: true})
        const latency = ping.createdTimestamp - interaction.createdTimestamp
        await interaction.editReply({ content: `* Latency \n    ** * ${latency}**`, ephemeral: true})
    }
}