import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to the next song in the queue"),

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

      const currentTrack = queue.current;
      queue.node.skip();

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`⏭️ Skipped **${currentTrack.title}**`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Skip command error:", error);
      interaction.reply({
        content: "❌ An error occurred while skipping!",
        ephemeral: true,
      });
    }
  },
};
