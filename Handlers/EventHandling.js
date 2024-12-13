const fs = require('node:fs');
const path = require('node:path');
const Log = require('../Utils/logs.js');

module.exports = (client, silent = false) => {
    const eventsPath = path.join(__dirname, '../Events');
    const handlePath = path.join(__dirname, '../Events/Interactions')
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    const handleFiles = fs.readdirSync(handlePath).filter(x => x.endsWith('js'))
    
    if (!silent) {
        Log.event(`Event Count: ${client.logs.colors.grey}${eventFiles.length}`);
    }

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const eventModule = require(filePath);
        if (eventModule.once) {
            client.once(eventModule.event, (...args) => eventModule.execute(...args, client));
        } else {
            client.on(eventModule.event, (...args) => eventModule.execute(...args, client));
        }
    }

    for (const file of handleFiles) {
        const filePath = path.join(handlePath, file);
        const eventModule = require(filePath);
        if (eventModule.once) {
            client.once(eventModule.event, (...args) => eventModule.execute(...args, client));
        } else {
            client.on(eventModule.event, (...args) => eventModule.execute(...args, client));
        }
    }
}