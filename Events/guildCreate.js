const console = require('../Other/logs.js');

module.exports = {
    event: 'guildCreate',
    
     async execute(guild) {
        console.login(`[ EVENT & BOT ] guildCreate: Bot has joined ${guild.name}`)
    }
};