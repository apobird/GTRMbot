const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("機密性のあるコード管理をします！")
        .addStringOption((option) =>
            option.setName("コード").setDescription("ここにルームコードを書いてください！").setRequired(true)
        ),
    async execute(interaction) {
        const code = interaction.options.getString("コード");
        const ownerId = interaction.user.id;
        const ownerTag = interaction.user.tag;
        const formattedID = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
        let d = new Date();

        console.log(`${ownerId}(${ownerTag})が${d}にコードを${code}に設定しました！(ID:${formattedID})`)

        const mcEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("ルームコードを設定しました！")
            .setDescription(
                `下のボタンをクリックするとルームコードが表示されます！\nこのルームコードの作成者: ${ownerTag}\n識別用ランダムID: ${formattedID}`
            )
            .setTimestamp();

        const showCodeButton = new ButtonBuilder()
            .setCustomId(`show_code:${code}|${formattedID}|${d}`)
            .setLabel("ルームのコードを見る")
            .setStyle(ButtonStyle.Success);

        const deleteButton = new ButtonBuilder()
            .setCustomId(`delete_embed:${ownerId}|${formattedID}|${d}`)
            .setLabel("このコードを消す")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(showCodeButton, deleteButton);

        await interaction.reply({ embeds: [mcEmbed], components: [row] });

        await interaction.followUp({
            content: `コードを **${code}** に設定し、成功しました！ (識別ID: ${formattedID})`,
            flags: MessageFlags.Ephemeral,
        });
    },
};  