import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Get information about the server"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`📊 ${guild.name} Information`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Server ID", value: guild.id, inline: true },
        { name: "Owner", value: owner.user.tag, inline: true },
        {
          name: "Created",
          value: `<t:${Math.floor(guild.createdAt / 1000)}:D>`,
          inline: true,
        },
        { name: "Member Count", value: `${guild.memberCount}`, inline: true },
        { name: "Channel Count", value: `${guild.channels.cache.size}`, inline: true },
        { name: "Role Count", value: `${guild.roles.cache.size}`, inline: true },
        {
          name: "Verification Level",
          value: guild.verificationLevel,
          inline: true,
        },
        {
          name: "Boost Level",
          value: `Level ${guild.premiumTier}`,
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
