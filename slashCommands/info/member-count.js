import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("member-count")
    .setDescription("Shows the member count of the server"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const totalMembers = guild.memberCount;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const users = totalMembers - bots;

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("👥 Member Count")
      .addFields(
        { name: "Total Members", value: `${totalMembers}`, inline: true },
        { name: "Users", value: `${users}`, inline: true },
        { name: "Bots", value: `${bots}`, inline: true }
      );

    interaction.reply({ embeds: [embed] });
  },
};
