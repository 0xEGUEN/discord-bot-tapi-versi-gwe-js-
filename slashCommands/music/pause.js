import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song"),

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

      queue.node.pause();

      const embed = new EmbedBuilder()
        .setColor("#ffd700")
        .setDescription(`⏸️ Paused **${queue.current.title}**`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Pause command error:", error);
      interaction.reply({
        content: "❌ An error occurred while pausing!",
        ephemeral: true,
      });
    }
  },
};
