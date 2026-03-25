import { EmbedBuilder } from "discord.js";

export default {
  name: "help",
  aliases: ["h", "commands", "cmd"],
  category: "general",
  description: "Shows available commands",
  permissions: [],
  ownerOnly: false,

  async execute(message, args, client) {
    const prefix = process.env.PREFIX || "!";
    let commands = Array.from(client.commands.values());

    if (args[0]) {
      const command = client.commands.get(
        args[0].toLowerCase() || client.aliases.get(args[0].toLowerCase())
      );

      if (!command) {
        return message.reply("❌ Command not found!");
      }

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle(`📖 Command: ${command.name}`)
        .setDescription(command.description || "No description provided")
        .addFields(
          {
            name: "🔤 Usage",
            value: `\`${prefix}${command.name}${
              command.usage ? ` ${command.usage}` : ""
            }\``,
            inline: false,
          },
          {
            name: "🔗 Aliases",
            value: command.aliases?.length ? `\`${command.aliases.join("`, `")}\`` : "None",
            inline: true,
          },
          {
            name: "📂 Category",
            value: command.category || "uncategorized",
            inline: true,
          }
        )
        .setFooter({ text: `Requested by ${message.author.username}` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Group commands by category
    const categories = {};
    commands.forEach((cmd) => {
      const category = cmd.category || "uncategorized";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(cmd);
    });

    const categoryEmojis = {
      general: "📚",
      admin: "🛡️",
      fun: "🎮",
      info: "ℹ️",
      music: "🎵",
      nsfw: "⛔",
    };

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🤖 Bot Commands")
      .setDescription(
        `Use \`${prefix}help [command]\` untuk info lebih detail!\nAtau gunakan \`/menu\` untuk menu interaktif!\n\n`
      )
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }));

    for (const [category, cmds] of Object.entries(categories)) {
      const emoji = categoryEmojis[category] || "📌";
      const commandsList = cmds
        .map((cmd) => `\`${cmd.name}\``)
        .join(" ");
      embed.addFields({
        name: `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)} (${cmds.length})`,
        value: commandsList || "No commands",
        inline: false,
      });
    }

    embed.setFooter({ text: `Total Commands: ${commands.length}` });
    embed.setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
