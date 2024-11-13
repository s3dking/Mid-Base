module.exports = {
    command: 'client',
    
    async execute(client, interaction) {
        client.logs.util(client)
        interaction.reply('Client Logged')

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

        await interaction.channel.send({ content: 'button',components: [button]})
    }
};