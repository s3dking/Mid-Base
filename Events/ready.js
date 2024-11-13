module.exports = {
    event: 'ready',
    once: false,
    
    execute: function(client, ...args) {
        client.logs.login(`${client.user.tag} Is Online`)
    }
};