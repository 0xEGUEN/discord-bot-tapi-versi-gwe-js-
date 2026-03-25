import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("This command is not available for this bot"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⛔ NSFW Command")
      .setDescription(
        "NSFW commands are disabled for this bot. Please enable them in the command settings if needed."
      );

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
