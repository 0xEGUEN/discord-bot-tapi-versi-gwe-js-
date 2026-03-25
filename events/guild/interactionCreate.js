export default {
  name: "interactionCreate",
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        return interaction.reply({
          content: "❌ Command not found!",
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error executing slash command ${interaction.commandName}:`, error);
        return interaction.reply({
          content: "❌ There was an error executing this command!",
          ephemeral: true,
        });
      }
    }

    // Handle button interactions
    if (interaction.isButton()) {
      // Handle button logic here
    }

    // Handle select menus
    if (interaction.isStringSelectMenu()) {
      // Handle select menu logic here
    }

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      // Handle modal logic here
    }
  },
};
