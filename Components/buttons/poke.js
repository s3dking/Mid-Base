module.exports = {
    customId: 'poke',
    async execute(interaction, client) {
        const randomQuestions = [
            'Ouch!!',
            'Stop Pressing The Button!!',
            'That Hurts!!',
            "Hey!",
            "Why did you poke me?!?!"
        ]
        const random = randomQuestions[Math.floor(Math.random() * randomQuestions.length)]
        await interaction.reply({ content: `${random}`, ephemeral: true})
    }
}