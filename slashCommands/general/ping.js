import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's latency"),

  async execute(interaction, client) {
    const latency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR || "#0099ff")
      .setDescription(`🏓 Pong! Latency: **${latency}ms**`);

    interaction.reply({ embeds: [embed] });
  },
};
