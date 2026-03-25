import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Get information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get info about")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR || "#0099ff")
      .setTitle(`${user.username}'s Information`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: user.username, inline: true },
        { name: "Discord ID", value: user.id, inline: true },
        {
          name: "Account Created",
          value: `<t:${Math.floor(user.createdAt / 1000)}:D>`,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedAt / 1000)}:D>`,
          inline: true,
        },
        {
          name: "Roles",
          value:
            member.roles.cache
              .filter((r) => r.name !== "@everyone")
              .map((r) => r)
              .join(", ") || "None",
          inline: false,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
