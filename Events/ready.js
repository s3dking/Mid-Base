module.exports = {
    event: 'ready',
    once: false,
    async execute(args, client) {
        client.logs.login(`${client.user.tag} ( ${client.user.id} ) Has Connected To Mid Base V5`)
    }
};