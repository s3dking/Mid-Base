const console = require('../Other/logs.js');

module.exports = {
    event: 'guildDelete',
    
     async execute(guild) {
        console.event(`[ EVENT & BOT ] guildDelete: Bot has left ${guild.name}`)
    }
};