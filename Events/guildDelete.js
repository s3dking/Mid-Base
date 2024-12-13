module.exports = {
    event: 'guildDelete',
    once: false,
    
    async execute(guild, client) {
        client.logs.event(`${client.user.tag} ( ${client.user.id} ) Has Left ${guild.name}`)
    }
};