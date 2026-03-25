import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused song"),

  async execute(interaction, client) {
    try {
      const { player } = client;
      const queue = player.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: "❌ No queue found!",
          ephemeral: true,
        });
      }

      if (queue.node.isPlaying()) {
        return interaction.reply({
          content: "❌ Music is already playing!",
          ephemeral: true,
        });
      }

      queue.node.resume();

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`▶️ Resumed **${queue.current.title}**`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Resume command error:", error);
      interaction.reply({
        content: "❌ An error occurred while resuming!",
        ephemeral: true,
      });
    }
  },
};
