// THANK YOU TO ghowsting.dev FOR LETTING ME USE THIS

const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const Log = require('../Utils/logs.js');
    client.components = new Map();

    const componentsPath = path.join(__dirname, '../Components');
    const subFolders = fs.readdirSync(componentsPath).filter(file => fs.statSync(path.join(componentsPath, file)).isDirectory());
    
    let totalComponents = 0;
    const folderCounts = {};

    for (const folder of subFolders) {
        var folderPath = path.join(componentsPath, folder);
        var componentFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        folderCounts[folder] = componentFiles.length;
        totalComponents += componentFiles.length;

        for (const file of componentFiles) {
            var component = require(path.join(folderPath, file));

            if (!component.customId) {
                Log.error(`The component at ${path.join(folderPath, file)} is missing a required "customId" property.`);
                continue;
            }

            if (!component.execute) {
                Log.warn(`The component at ${path.join(folderPath, file)} is missing a required "execute" property.`);
                continue;
            }

            if (client.components.has(component.customId)) {
                Log.warn(`A component with the customId "${component.customId}" already exists.`);
                continue;
            }

            client.components.set(component.customId, component);
        }

        client.logs.comp(`${folder} Count: ${client.logs.colors.grey}${componentFiles.length}`);
    }

    client.logs.comp(`Total Count: ${client.logs.colors.grey}${totalComponents}`);
}