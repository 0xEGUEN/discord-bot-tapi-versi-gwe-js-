import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current music queue"),

  async execute(interaction, client) {
    try {
      const { player } = client;
      const queue = player.getQueue(interaction.guild);

      if (!queue || queue.tracks.length === 0) {
        return interaction.reply({
          content: "❌ Queue is empty!",
          ephemeral: true,
        });
      }

      const tracks = queue.tracks.slice(0, 10);
      const songList = tracks
        .map((track, index) => `${index + 1}. **${track.title}** by ${track.author}`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🎵 Music Queue")
        .setDescription(songList || "No songs in queue")
        .setFooter({
          text: `Total: ${queue.tracks.length} songs | Now: ${queue.current.title}`,
        });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Queue command error:", error);
      interaction.reply({
        content: "❌ An error occurred while fetching the queue!",
        ephemeral: true,
      });
    }
  },
};
