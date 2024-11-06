const saySchema = require('../../Schemas/saySchema.js')

module.exports = {
    customId: 'send',
    async execute(interaction, args, client) {
        const data = await saySchema.find();
        var values = [];
        await data.forEach(async x => {
            values.push(x.Content);
        })
        let val = values.join('\n')
        if (!val) {
            let val = 'No value found'
        }
        await interaction.reply(`${val}`);
        await data.forEach(async x => {
            await saySchema.deleteOne({ name: x.name})
        })
    }
};