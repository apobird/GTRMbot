const { SlashCommandBuilder, EmbedBuilder, MessageFlags, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("GTRMbotのコマンド一覧を紹介します！"),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("GTRMbotコマンド一覧")
            .setDescription(
                `
            以下はコマンド一覧です！※【必須】はそのコマンドを使うときに必須なオプションです。
            __**/help**__
            コマンド一覧を表示
            
            __**/mc**__
            コードを作成
            【必須】「コード:」でコードを設定します。
            「ルームのコードを見る」でコードを表示します(押した人のみ閲覧可能)。
            「このコードを消す」でコードを削除します(作者のみ削除可能)。
            コードを押した人は公に通知され、識別IDで特定されます。
            例:「/mc コード:johokyoku」
            
            __**/poll**__
            ポールを作成
            【必須】「質問:」で質問を設定します。
            「選択肢:」で選択肢を20個まで設定できます。選択肢を追加するときは半角スペース( )で区切ってください。
            「テキスト:」でそのほかに情報を書きます。
            「時刻:」で設定した時刻にポールを作成します。18:00のように書いて設定します。※時刻は日本標準時(JST)です。
            質問が空の場合はYes/Noでの投票となります。
            ※その日の時間のみ設定可能です。
            例:「/poll 質問:8時からGT 選択肢:やる|やらない|途中|補欠 テキスト:マップはフォレスト 時刻:18:00」
            
            __**/ping**__
            ラグなどを表示
            `
            )

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral, });
    }
}
