module.exports = {
    customId: 'latency',
    async execute(interaction, client) {
        const ping = await interaction.reply({ content: 'Recieving the botss latency... ⏰', ephemeral: true})
        const latency = ping.createdTimestamp - interaction.createdTimestamp
        await interaction.editReply({ content: `* Latency \n    ** * ${latency}**`, ephemeral: true})
    }
}