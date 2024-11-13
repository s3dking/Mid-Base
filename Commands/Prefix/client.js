module.exports = {
    command: 'client',
    
    async execute(message, args, client) {
		client.logs.util(client)
        message.reply('Client Logged')

        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    custom_id: 'client',
                    label: 'Client',
                    style: 1
                }
            ]
        }

        await message.channel.send({ content: 'button', components: [button]})
    }
};