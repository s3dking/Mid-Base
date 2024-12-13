module.exports = {
    name: 'ping',
    execute: async(message, client) => {
        const embed = {
            title: "Here is this bots latency:",
            color: 0x1bcf09,
            description: `Press the buttons to get the bots latency`
        }
        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    custom_id: 'apilatency',
                    label: 'API Latency',
                    emoji: '📊'
                },
                {
                    type: 2,
                    style: 1,
                    custom_id: 'latency',
                    label: 'Latency', 
                    emoji: '📊'
                }
            ]
        }

        await message.reply({ embeds: [embed], components: [button]})
    }
 }