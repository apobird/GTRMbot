const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("ポールを選択肢とともに作るためのコマンドです！")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("質問")
        .setDescription("ポールのための質問をここに書いてください！")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("選択肢")
        .setDescription(
          "選択肢をここに書いてください！選択肢をわけるには半角スペースを使ってください！"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("テキスト")
        .setDescription("エムベッドの下にかくテキストをここに書いてください！")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("時刻")
        .setDescription("ポールを開始する時刻を `HH:mm` の形で書いてください！")
        .setRequired(false)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("質問");
    const answer = interaction.options.getString("選択肢") || "";
    const text = interaction.options.getString("テキスト") || "";
    const startTimeString = interaction.options.getString("時刻") || "";
    const ownerTag = interaction.user.tag;

    const reactions = {
      1: "🇦",
      2: "🇧",
      3: "🇨",
      4: "🇩",
      5: "🇪",
      6: "🇫",
      7: "🇬",
      8: "🇭",
      9: "🇮",
      10: "🇯",
      11: "🇰",
      12: "🇱",
      13: "🇲",
      14: "🇳",
      15: "🇴",
      16: "🇵",
      17: "🇶",
      18: "🇷",
      19: "🇸",
      20: "🇹",
    };

    const answerList = answer ? answer.split(" ").map((c) => c.trim()) : [];

    let startTime;
    if (startTimeString) {
      // HH:mm形式チェック
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(startTimeString)) {
        return interaction.reply({
          content: "時刻は `HH:mm` の形式で入力してください！（例: 18:15）",
          flags: MessageFlags.Ephemeral,
        });
      }

      const now = new Date();
      const [hours, minutes] = startTimeString.split(":").map(Number);
      startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );

      // startTime が過去の場合の処理
      if (startTime <= now) {
        return interaction.reply({
          content: `指定された時刻が過去になっています。未来の時刻を指定してください！`,
          flags: MessageFlags.Ephemeral,
        });
      }

      await interaction.reply({
        content: `ポールが ${startTime.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })} に開始されます！お待ちください。`,
      });
    } else {
      // 即時開始
      startTime = new Date();
      await interaction.reply({
        content: `ポールが即座に作成されます！`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Embedを作成
    const pollEmbed = new EmbedBuilder()
      .setColor("Aqua")
      .setTimestamp()
      .setDescription(`**質問:** ${question}`);

    if (answerList.length > 0) {
      if (answerList.length > 20) {
        return interaction.followUp({
          content: "選択肢は最大20個まで追加可能です。",
          flags: MessageFlags.Ephemeral,
        });
      }

      const answerOption = answerList
        .map((c, i) => `${reactions[i + 1]} ${c}`)
        .join("\n");
      pollEmbed.setDescription(
        `**質問:** ${question}\n\n${answerOption}\n\n作者:${ownerTag}`
      );
    } else {
      pollEmbed.setDescription(
        `**質問:** ${question}\n\n✅ Yes\n❎ No\n\n作者:${ownerTag}`
      );
    }

    // 指定時刻まで待機してポールを作成
    const delay = startTime - new Date();
    setTimeout(async () => {
      const msg = await interaction.channel.send({
        content: text,
        embeds: [pollEmbed],
      });

      if (answerList.length > 0) {
        answerList.forEach((_, i) => msg.react(reactions[i + 1]));
      } else {
        msg.react("✅");
        msg.react("❎");
      }
    }, Math.max(delay, 0)); // delayが0未満の場合即座に送信
  },
};