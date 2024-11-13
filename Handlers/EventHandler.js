const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const Log = require('../Other/logs.js');
    const eventsPath = path.join(__dirname, '../Events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    Log.event(`Loaded ${eventFiles.length} file(s)`);

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const eventModule = require(filePath);
        Log.event(`Loaded: ${eventModule.event}`);
        if (eventModule.once) {
            client.once(eventModule.event, (...args) => eventModule.execute(...args, client));
        } else {
            client.on(eventModule.event, (...args) => eventModule.execute(...args, client));
        }
    }
};