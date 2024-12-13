module.exports = {
    name: 'poke',
    async execute(message, args, client) {

        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    custom_id: 'poke',
                    style: 1,
                    label: 'Poke',
                    emoji: '👆'
                }
            ]
        }

        await message.reply({ content: 'Poke Me!', components: [button] })
    }
}
