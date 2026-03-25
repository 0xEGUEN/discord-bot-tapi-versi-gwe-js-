import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Specific command to get help about")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const commandName = interaction.options.getString("command");
    const commands = Array.from(client.commands.values());

    if (commandName) {
      const command = client.commands.get(commandName.toLowerCase());

      if (!command) {
        return interaction.reply({
          content: `❌ Command \`${commandName}\` not found!`,
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle(`📖 Command: ${command.name}`)
        .setDescription(command.description || "No description provided")
        .addFields(
          {
            name: "🔤 Usage",
            value: `\`!${command.name}${command.usage ? ` ${command.usage}` : ""}\``,
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
        .setFooter({ text: `Use /menu for interactive menu` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
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
        `Use \`/help [command]\` untuk info lebih detail!\nAtau gunakan \`/menu\` untuk menu interaktif!\n\n`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

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

    embed.setFooter({ text: `Total Commands: ${commands.length} | Click /menu for interactive menu` });
    embed.setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
