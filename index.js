import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { readdir } from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { initializePlayer } from "./handlers/musicHandler.js";

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initialize collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.events = new Collection();
client.aliases = new Collection();

// Will be initialized after loadHandlers
client.player = null;

/**
 * Handler untuk load events
 */
async function loadEvents() {
  const eventsPath = join(__dirname, "events");
  const eventFolders = await readdir(eventsPath);

  for (const folder of eventFolders) {
    const folderPath = join(eventsPath, folder);
    const eventFiles = await readdir(folderPath);

    for (const file of eventFiles.filter((file) => file.endsWith(".js"))) {
      const filePath = join(folderPath, file);
      const event = await import(pathToFileURL(filePath).href);
      const eventHandler = event.default || event;

      if (eventHandler.name) {
        if (eventHandler.once) {
          client.once(eventHandler.name, (...args) =>
            eventHandler.execute(...args, client)
          );
        } else {
          client.on(eventHandler.name, (...args) =>
            eventHandler.execute(...args, client)
          );
        }
        console.log(`✅ Event loaded: ${eventHandler.name}`);
      }
    }
  }
}

/**
 * Handler untuk load text commands
 */
async function loadCommands() {
  const commandsPath = join(__dirname, "commands");
  const commandFolders = await readdir(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = await readdir(folderPath);

    for (const file of commandFiles.filter((file) => file.endsWith(".js"))) {
      const filePath = join(folderPath, file);
      const command = await import(pathToFileURL(filePath).href);
      const commandHandler = command.default || command;

      if (commandHandler.name) {
        client.commands.set(commandHandler.name, commandHandler);

        if (commandHandler.aliases && Array.isArray(commandHandler.aliases)) {
          commandHandler.aliases.forEach((alias) => {
            client.aliases.set(alias, commandHandler.name);
          });
        }
        console.log(`✅ Command loaded: ${commandHandler.name}`);
      }
    }
  }
}

/**
 * Handler untuk load slash commands
 */
async function loadSlashCommands() {
  const slashCommandsPath = join(__dirname, "slashCommands");
  const slashCommandFolders = await readdir(slashCommandsPath);

  for (const folder of slashCommandFolders) {
    const folderPath = join(slashCommandsPath, folder);
    const slashCommandFiles = await readdir(folderPath);

    for (const file of slashCommandFiles.filter((file) =>
      file.endsWith(".js")
    )) {
      const filePath = join(folderPath, file);
      const slashCommand = await import(pathToFileURL(filePath).href);
      const slashCommandHandler = slashCommand.default || slashCommand;

      if (slashCommandHandler.data && slashCommandHandler.execute) {
        client.slashCommands.set(
          slashCommandHandler.data.name,
          slashCommandHandler
        );
        console.log(`✅ Slash Command loaded: ${slashCommandHandler.data.name}`);
      }
    }
  }
}

/**
 * Load semua handler saat bot startup
 */
async function loadHandlers() {
  try {
    console.log("\n🔄 Loading events...");
    await loadEvents();

    console.log("\n🔄 Loading commands...");
    await loadCommands();

    console.log("\n🔄 Loading slash commands...");
    await loadSlashCommands();

    console.log("\n🔄 Initializing music player...");
    client.player = await initializePlayer(client);

    console.log("\n✅ All handlers loaded successfully!\n");
  } catch (error) {
    console.error("❌ Error loading handlers:", error);
    process.exit(1);
  }
}

/**
 * Startup
 */
(async () => {
  await loadHandlers();

  try {
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error("❌ Failed to login:", error);
    process.exit(1);
  }
})();
