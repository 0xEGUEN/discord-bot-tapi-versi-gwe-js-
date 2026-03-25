import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Display interactive command menu"),

  async execute(interaction, client) {
    // Create buttons for each category
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("menu_general")
        .setLabel("📚 General")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("menu_admin")
        .setLabel("🛡️ Admin")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("menu_fun")
        .setLabel("🎮 Fun")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("menu_info")
        .setLabel("ℹ️ Info")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("menu_music")
        .setLabel("🎵 Music")
        .setStyle(ButtonStyle.Primary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("menu_close")
        .setLabel("✖️ Close")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🤖 Discord Bot Menu")
      .setDescription("Pilih kategori untuk melihat commands:")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "📚 General", value: "Basic commands", inline: true },
        { name: "🛡️ Admin", value: "Moderation", inline: true },
        { name: "🎮 Fun", value: "Games & fun", inline: true },
        { name: "ℹ️ Info", value: "Server info", inline: true },
        { name: "🎵 Music", value: "Music player", inline: true }
      )
      .setFooter({ text: "Click buttons to view commands" })
      .setTimestamp();

    const message = await interaction.reply({
      embeds: [embed],
      components: [row1, row2],
    });

    // Create collector for button interactions
    const collector = message.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({
          content: "❌ You can't use this menu!",
          ephemeral: true,
        });
      }

      const customId = buttonInteraction.customId;

      // Get all slash commands and group by category
      const categories = {
        general: [],
        admin: [],
        fun: [],
        info: [],
        music: [],
      };

      client.slashCommands.forEach((cmd) => {
        const cmdName = cmd.data.name;
        // Map command names to categories
        if (["help", "ping", "menu", "user-info"].includes(cmdName)) {
          categories.general.push({ name: cmdName, description: cmd.data.description });
        } else if (["ban", "kick", "purge"].includes(cmdName)) {
          categories.admin.push({ name: cmdName, description: cmd.data.description });
        } else if (["8ball", "dice", "flip"].includes(cmdName)) {
          categories.fun.push({ name: cmdName, description: cmd.data.description });
        } else if (["avatar", "member-count", "server-info"].includes(cmdName)) {
          categories.info.push({ name: cmdName, description: cmd.data.description });
        } else if (
          ["nowplaying", "pause", "play", "queue", "resume", "skip", "stop"].includes(
            cmdName
          )
        ) {
          categories.music.push({ name: cmdName, description: cmd.data.description });
        }
      });

      let selectedCategory = null;

      switch (customId) {
        case "menu_general":
          selectedCategory = "general";
          break;
        case "menu_admin":
          selectedCategory = "admin";
          break;
        case "menu_fun":
          selectedCategory = "fun";
          break;
        case "menu_info":
          selectedCategory = "info";
          break;
        case "menu_music":
          selectedCategory = "music";
          break;
        case "menu_close":
          await buttonInteraction.update({ components: [] });
          collector.stop();
          return;
      }

      if (selectedCategory) {
        const categoryCommands = categories[selectedCategory] || [];

        const categoryEmojis = {
          general: "📚",
          admin: "🛡️",
          fun: "🎮",
          info: "ℹ️",
          music: "🎵",
        };

        const cmdEmbed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(
            `${categoryEmojis[selectedCategory]} ${
              selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
            } Commands`
          )
          .setDescription(
            categoryCommands.length > 0
              ? categoryCommands
                  .map(
                    (cmd) =>
                      `\`/${cmd.name}\` - ${cmd.description || "No description"}`
                  )
                  .join("\n")
              : "No commands in this category"
          )
          .setFooter({
            text: `Total: ${categoryCommands.length} commands`,
          })
          .setTimestamp();

        const backRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("menu_back")
            .setLabel("⬅️ Back")
            .setStyle(ButtonStyle.Secondary)
        );

        await buttonInteraction.update({
          embeds: [cmdEmbed],
          components: [backRow],
        });
      }
    });

    // Handle menu_back button
    const backCollector = message.createMessageComponentCollector({
      time: 60000,
    });

    backCollector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId !== "menu_back") {
        return;
      }

      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({
          content: "❌ You can't use this menu!",
          ephemeral: true,
        });
      }

      await buttonInteraction.update({
        embeds: [embed],
        components: [row1, row2],
      });
    });

    // Clean up collectors when time ends
    collector.on("end", () => {
      backCollector.stop();
      message.edit({ components: [] }).catch(() => {});
    });
  },
};
