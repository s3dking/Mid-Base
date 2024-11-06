const console = require('../Utils/logs.js');

module.exports = {
    event: 'ready',
    once: false,
    
    execute: function(client, ...args) {
        console.login(`[ BOT ] ${client.user.tag} Is Online`)
    }
};