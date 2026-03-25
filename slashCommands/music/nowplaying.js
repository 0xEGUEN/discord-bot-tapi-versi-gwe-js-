import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show the currently playing song"),

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

      const track = queue.current;
      const progress = queue.node.createProgressBar();

      const embed = new EmbedBuilder()
        .setColor("#ff1493")
        .setTitle("🎵 Now Playing")
        .setDescription(`**${track.title}** by **${track.author}**`)
        .addFields(
          {
            name: "Duration",
            value: `\`${progress}\``,
            inline: false,
          },
          {
            name: "Up Next",
            value: queue.tracks[0] ? queue.tracks[0].title : "Queue empty",
            inline: true,
          },
          {
            name: "Queue Length",
            value: `${queue.tracks.length} songs`,
            inline: true,
          }
        )
        .setThumbnail(track.thumbnail);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Now playing command error:", error);
      interaction.reply({
        content: "❌ An error occurred!",
        ephemeral: true,
      });
    }
  },
};
