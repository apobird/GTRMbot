const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // Name Of Slash Command
        .setDescription('Pong!と情報をお教えします！'), // Description Of Slash Command
    async execute(interaction, client) {
        const message = await interaction.deferReply({ fetchReply: true }) // .deferReply Will Make The Bot Think For A While Before Send Response
        const pingmsg = `Pong!🏓\n以下はbotの遅延についてです！\nAPIのデータ遅延: ${client.ws.ping}\nボットのPing: ${message.createdTimestamp - interaction.createdTimestamp}`
        await interaction.editReply(pingmsg)
    }
}