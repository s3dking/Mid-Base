// THANK YOU TO ghowsting.dev FOR LETTING ME USE THIS

const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const Log = require('../Utils/logs.js');
    client.components = new Map();

    const componentsPath = path.join(__dirname, '../Components');
    const subFolders = fs.readdirSync(componentsPath).filter(file => fs.statSync(path.join(componentsPath, file)).isDirectory());

    for (const folder of subFolders) {
        const folderPath = path.join(componentsPath, folder);
        const componentFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of componentFiles) {
            const component = require(path.join(folderPath, file));

            Log.success(`[ COMPONENT ] Loaded: ${component.customId}`);

            if (!component.customId) {
                Log.error(`The component at ${path.join(folderPath, file)} is missing a required "customId" property.`);
                continue;
            }

            if (!component.execute) {
                Log.warn(`The component at ${path.join(folderPath, file)} is missing a required "execute" property.`);
                continue;
            }

            if (client.components.has(component.customId)) {
                Log.warn(`[WARNING] A component with the customId "${component.customId}" already exists.`);
            }

            if (component.customId) {
                client.components.set(component.customId, component);
            }
        }
    }

    client.on('interactionCreate', async interaction => {
        const Log = require('../Utils/logs.js');
        if (!interaction.isButton() && !interaction.isAnySelectMenu() && !interaction.isModalSubmit()) return;

        const component = client.components.get(interaction.customId);
        if (!component) return;

        try {
            await component.execute(interaction, client);
            Log.log(`[ COMPONENT ] ${interaction.customId} has been executed by ${interaction.user.tag}`);
        } catch (error) {
            Log.error(error);
            await interaction.reply({
                content: 'There was an error while executing this component!',
                ephemeral: true
            }).catch(Log.error);
        }
    });
};