module.exports = {
    customId: 'say',
    async execute(interaction, args, client) {
        const input = interaction.fields.getTextInputValue('txt');
        await interaction.channel.send(`${input}`);
        await interaction.reply({ content: `Received: ${input}`, ephemeral: true });
    }
};