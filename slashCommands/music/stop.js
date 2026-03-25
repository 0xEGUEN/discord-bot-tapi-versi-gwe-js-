import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music and leave the voice channel"),

  async execute(interaction, client) {
    try {
      const { player } = client;
      const queue = player.getQueue(interaction.guild);

      if (!queue || !queue.playing) {
        return interaction.reply({
          content: "❌ No music is currently playing!",
          ephemeral: true,
        });
      }

      queue.destroy();

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("⏹️ Music stopped and left the voice channel");

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Stop command error:", error);
      interaction.reply({
        content: "❌ An error occurred while stopping the music!",
        ephemeral: true,
      });
    }
  },
};
