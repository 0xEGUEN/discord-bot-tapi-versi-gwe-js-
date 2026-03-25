import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete multiple messages")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount");

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ You don't have permission to manage messages!",
        ephemeral: true,
      });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      interaction.reply({
        content: `✅ Successfully deleted **${deleted.size}** messages!`,
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({
        content: "❌ Failed to delete messages!",
        ephemeral: true,
      });
    }
  },
};
