import { REST, Routes } from "discord.js";

/**
 * Handler untuk register slash commands ke Discord API
 * @param {Client} client - Discord client
 */
export async function registerSlashCommands(client) {
  const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

  if (!TOKEN || !CLIENT_ID) {
    console.error("❌ Missing TOKEN or CLIENT_ID in environment variables");
    return;
  }

  const commands = Array.from(client.slashCommands.values()).map((cmd) =>
    cmd.data.toJSON()
  );

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log(
      `🔄 Started refreshing ${commands.length} application (/) commands.`
    );

    let data;
    if (GUILD_ID) {
      // Register untuk guild tertentu (development)
      data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log(
        `✅ Successfully reloaded ${data.length} guild (/) commands.`
      );
    } else {
      // Register untuk semua guild (production)
      data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
      console.log(
        `✅ Successfully reloaded ${data.length} global (/) commands.`
      );
    }
  } catch (error) {
    console.error("❌ Error registering slash commands:", error);
  }
}
