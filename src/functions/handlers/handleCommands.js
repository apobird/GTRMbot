const { REST, Routes } = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env.TOKEN;
const APPID = process.env.APPID;

module.exports = (client) => {
    client.handleCommands = async () => {
        // Registring Commands
        const commandFolders = fs.readdirSync('./Commands')
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js')) // Read Folders In Commands Folder

            const { commands, commandArray } = client
            for (const file of commandFiles) {
                const command = require(`../../../Commands/${folder}/${file}`) // Read Files Of Command Folder
                commands.set(command.data.name, command) // Register Command
                commandArray.push(command.data.toJSON())
            }
        }

        const clientID = APPID // Bot ID
        const guildID = '1061941946786009128' // Server ID In Which Your Slash Commands Should Work If You Don't Want For Multi Servers
        const rest = new REST({ version: '10' }).setToken(TOKEN)

        try {
            console.log(`Discordのbotコマンドをすべて更新中`)

            await rest.put(
                //Routes.applicationGuildCommands(clientID, guildID), // This Will Work For Specific Guild(Server)
                Routes.applicationCommands(clientID), // This Will Work For Multi Guild(Server)
                { body: client.commandArray }
            )

        // グローバルコマンドの取得
        console.log('グローバルコマンドを取得中...');
        const globalCommands = await rest.get(
            Routes.applicationCommands(clientID)
        );
        console.log('登録されているグローバルコマンド:');
        globalCommands.forEach(cmd => {
            console.log(`- ${cmd.name}: ${cmd.description}`);
        });

        // 特定のサーバーのコマンドを取得
        console.log('\nギルドコマンドを取得中...');
        const guildCommands = await rest.get(
            Routes.applicationGuildCommands(clientID, guildID)
        );
        console.log('登録されているギルドコマンド:');
        guildCommands.forEach(cmd => {
            console.log(`- ${cmd.name}: ${cmd.description}`);
        });

            console.log(`更新完了`)
        } catch (error) {
            console.error(error)
        }
    }
}