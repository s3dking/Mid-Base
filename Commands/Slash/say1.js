const { SlashCommandBuilder } = require('discord.js');
const saySchema = require('../../Schemas/saySchema.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayy')
        .setDescription('Command description')
        .addStringOption(x => x.setName('text').setDescription('The text that you want the bot to say').setRequired(true)),
        
    async execute(interaction, client) {
        const text = interaction.options.getString('text')
        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    label: 'Send',
                    emoji: '✔',
                    custom_id: 'send'
                }
            ]
        }
        const embed = {
            color: 0xffffff,
            description: `You said: \n**${text}**\nPress The Button Below If You Want To Send The Message!`
        }
        await saySchema.create({
            Content: text
        });
        await interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    }
};