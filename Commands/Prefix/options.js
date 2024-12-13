module.exports = {
    name: 'options',
    async execute(message, args, client) {

        const menu = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'menus',
                    options: [
                        {
                            label: 'Option One',
                            description: 'Option #1',
                            value: 'option1'
                        },
                        {
                            label: 'Option Two',
                            description: 'Option #2',
                            value: 'option2'
                        }
                    ],
                    placeholder: 'Options',
                }
            ]
        }

        await message.reply({ content: 'Press an option', components: [menu] })
    }
}