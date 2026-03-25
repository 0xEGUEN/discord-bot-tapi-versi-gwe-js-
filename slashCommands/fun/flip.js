import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("flip")
    .setDescription("Flip a coin"),

  async execute(interaction, client) {
    const flip = Math.random() > 0.5 ? "Heads" : "Tails";

    const embed = new EmbedBuilder()
      .setColor("#ffd700")
      .setTitle("🪙 Coin Flip")
      .setDescription(`**${flip}**`);

    interaction.reply({ embeds: [embed] });
  },
};
