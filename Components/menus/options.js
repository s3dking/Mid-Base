module.exports = {
    customId: 'menus',
    async execute(interaction, args, client) {
        const selected = interaction.values[0];
        await interaction.reply(`Selected: ${selected}`);
    }
};