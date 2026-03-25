import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8 ball a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Your question for the magic 8 ball")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const question = interaction.options.getString("question");

    const responses = [
      "Yes",
      "No",
      "Maybe",
      "Absolutely",
      "Definitely not",
      "Ask again later",
      "The stars say yes",
      "The stars say no",
      "Outlook not so good",
      "Don't count on it",
      "Very likely",
      "Unlikely",
    ];

    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor("#7289da")
      .setTitle("🎱 Magic 8 Ball")
      .addFields(
        { name: "Question", value: question },
        { name: "Answer", value: `**${answer}**` }
      );

    interaction.reply({ embeds: [embed] });
  },
};
