module.exports = {
    customId: 'say',
    async execute(interaction, client) {
        const message = interaction.fields.getTextInputValue('txt');
		await interaction.deferReply({ ephemeral: true });

        interaction.channel.send(message)
        interaction.editReply({ content: 'Message has been sent!', ephemeral: true})
    }
}