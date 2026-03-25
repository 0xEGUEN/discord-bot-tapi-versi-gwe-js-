import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to get avatar from")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));

    interaction.reply({ embeds: [embed] });
  },
};
