export default {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Ignore DMs
    if (!message.guild) return;

    const prefix = process.env.PREFIX || "!";

    // Check if message starts with prefix
    if (!message.content.startsWith(prefix)) return;

    // Get command and args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if command exists
    let command = client.commands.get(commandName);
    if (!command) {
      command = client.commands.get(client.aliases.get(commandName));
    }

    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`❌ Error executing command ${commandName}:`, error);
      message.reply({
        content: "❌ There was an error executing this command!",
        ephemeral: true,
      });
    }
  },
};
