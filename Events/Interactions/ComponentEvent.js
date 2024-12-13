const Log = require('../../Utils/logs.js');

module.exports = {
    event: 'interactionCreate',
    once: false,
    
    async execute(interaction, client) {
        if (!interaction.isButton() && !interaction.isAnySelectMenu() && !interaction.isModalSubmit()) return;

        const component = client.components.get(interaction.customId);
        if (!component) return;
        
        await component.execute(interaction, client);
        Log.comp(`${interaction.customId} has been executed by ${interaction.user.tag}`);
    }
};