import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides (default: 6)")
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(100)
    ),

  async execute(interaction, client) {
    const sides = interaction.options.getInteger("sides") || 6;
    const roll = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("🎲 Dice Roll")
      .setDescription(`You rolled a **${roll}** (out of ${sides})`);

    interaction.reply({ embeds: [embed] });
  },
};
