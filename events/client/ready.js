import { ActivityType } from "discord.js";
import { registerSlashCommands } from "../../handlers/commandHandler.js";

export default {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`\n✅ Bot login sebagai ${client.user.tag}\n`);

    // Register slash commands
    await registerSlashCommands(client);

    // Set bot status
    client.user.setActivity({
      name: "Slash Commands | prefix !",
      type: ActivityType.Playing,
    });

    console.log(`\n🎉 Bot is ready!\n`);
  },
};
