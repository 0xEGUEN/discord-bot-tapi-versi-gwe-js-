import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kicking")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "❌ You don't have permission to kick members!",
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(user.id);

    try {
      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("✅ User Kicked")
        .addFields(
          { name: "User", value: `${user.tag}`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason, inline: false }
        );

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      interaction.reply({
        content: "❌ Failed to kick the user!",
        ephemeral: true,
      });
    }
  },
};
