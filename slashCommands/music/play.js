import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube, Spotify, or SoundCloud")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song name or URL")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    // Check if user is in a voice channel
    if (!interaction.member.voice.channel) {
      return interaction.editReply({
        content: "❌ You must be in a voice channel to use this command!",
      });
    }

    try {
      const { player } = client;
      const song = interaction.options.getString("song");

      // Search for the song
      const result = await player.search(song, {
        requestedBy: interaction.user,
      });

      if (!result || !result.tracks || result.tracks.length === 0) {
        return interaction.editReply({
          content: "❌ No results found for that song!",
        });
      }

      // Create or get queue
      let queue = player.getQueue(interaction.guild);
      if (!queue) {
        queue = await player.createQueue(interaction.guild, {
          metadata: {
            channel: interaction.channel,
          },
        });
      }

      // Connect to voice channel if not connected
      if (!queue.connection) {
        try {
          await queue.connect(interaction.member.voice.channel);
        } catch (error) {
          console.error("Connection error:", error);
          return interaction.editReply({
            content: "❌ Failed to connect to voice channel!",
          });
        }
      }

      // Check if it's a playlist
      if (result.playlist) {
        queue.addTracks(result.tracks);

        const embed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("✅ Playlist Added")
          .setDescription(
            `Added **${result.tracks.length}** songs from ${result.playlist.title || "playlist"}`
          )
          .setThumbnail(result.tracks[0]?.thumbnail || null);

        if (!queue.playing) {
          await queue.play().catch(() => {});
        }

        return interaction.editReply({ embeds: [embed] });
      } else {
        // Add single track
        const track = result.tracks[0];
        queue.addTrack(track);

        const durationMs = track.durationMS || 0;
        const minutes = Math.floor(durationMs / 1000 / 60);
        const seconds = Math.floor((durationMs / 1000) % 60)
          .toString()
          .padStart(2, "0");

        const embed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("✅ Song Added to Queue")
          .addFields(
            { name: "Title", value: track.title || "Unknown", inline: true },
            { name: "Author", value: track.author || "Unknown", inline: true },
            {
              name: "Duration",
              value: `${minutes}:${seconds}`,
              inline: true,
            }
          )
          .setThumbnail(track.thumbnail || null)
          .setFooter({ text: `Queue size: ${queue.tracks.length}` });

        if (!queue.playing) {
          await queue.play().catch(() => {});
        }

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Play command error:", error);
      interaction.editReply({
        content: `❌ An error occurred: ${error.message || "Unknown error!"}`,
      });
    }
  },
};
