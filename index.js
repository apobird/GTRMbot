const { Client, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env.TOKEN;
const fs = require('fs');

// server.js をインポートして実行
require('./server');

// Discordクライアントの設定
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
client.commands = new Collection();
client.commandArray = [];

// Functionsの読み込み
const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js')); // Read Folders
    for (const file of functionFiles) require(`./src/functions/${folder}/${file}`)(client); // Read Files
}

client.handleCommands();
client.handleEvents();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const [action, rawValue] = interaction.customId.split(":");
    const [value, formattedID, d] = rawValue.split("|");

    if (action === "show_code") {
        await interaction.reply({
            content: `ルームのコードは **__${value}__** です。(識別ID: ${formattedID})`,
            flags: MessageFlags.Ephemeral,
        });

        await interaction.followUp({
            content: `<@${interaction.user.id}> がコードを確認しました！ (識別ID: ${formattedID})`,
        });

        console.log(`${interaction.user.tag}が${d}にコード(${value})を見ました！(ID:${formattedID})`);
    }

    if (action === "delete_embed") {
        const [ownerId] = value.split("|");

        if (interaction.user.id === ownerId) {
            await interaction.message.delete();
            await interaction.reply({
                content: `作成者がコードを削除しました！(識別ID: ${formattedID})`,
            });
        } else {
            await interaction.reply({
                content: "このコードを削除する権限がありません！",
                flags: MessageFlags.Ephemeral,
            });
        }

        console.log(`${interaction.user.tag}が${d}にコードを削除しました！(ID:${formattedID})`);
    }
});

client.login(TOKEN);