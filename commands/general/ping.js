import { EmbedBuilder } from "discord.js";

export default {
  name: "ping",
  aliases: ["latency"],
  category: "general",
  description: "Shows the bot's latency",
  permissions: [],
  ownerOnly: false,

  async execute(message, args, client) {
    const latency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR || "#0099ff")
      .setDescription(`🏓 Pong! Latency: **${latency}ms**`);

    message.reply({ embeds: [embed] });
  },
};
