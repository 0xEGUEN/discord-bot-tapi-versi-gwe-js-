# Discord Bot - JavaScript Edition

A multipurpose Discord bot built with discord.js 14, featuring both text commands and slash commands.

## Features

- ✨ **Text Commands** - Traditional prefix-based commands
- 🎯 **Slash Commands** - Modern Discord slash commands
- 🌍 **Multilingual Support** - Built-in internationalization (English, Indonesian)
- 📁 **Modular Structure** - Organized handlers and command system
- 🔧 **Easy to Extend** - Simple command and event creation system
- 🎨 **Embed Messages** - Built-in support for Discord embeds

## Requirements

- Node.js 18.0.0 or higher
- discord.js 14.0.0 or higher
- A Discord Bot Token

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Fill in your Discord bot token and other details in `.env`:
```
TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here (optional, for testing)
PREFIX=!
```

## Getting Your Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and click "Add Bot"
4. Under TOKEN section, click "Copy" to get your token
5. Add the token to your `.env` file

## Running the Bot

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Project Structure

```
discord-bot/
├── index.js                 # Main bot file
├── package.json             # Dependencies
├── .env.example            # Environment template
├── botconfig/              # Bot configuration files
│   ├── config.json        # Main config
│   └── emojis.json        # Emoji mapping
├── commands/               # Text commands
│   └── general/
│       ├── ping.js
│       └── help.js
├── slashCommands/          # Slash commands
│   └── general/
│       ├── ping.js
│       └── user-info.js
├── events/                 # Event handlers
│   ├── client/
│   │   ├── ready.js
│   │   └── error.js
│   └── guild/
│       ├── messageCreate.js
│       ├── interactionCreate.js
│       ├── guildCreate.js
│       └── guildDelete.js
├── handlers/               # Main handlers
│   └── commandHandler.js
├── languages/              # Translation files
│   ├── en.json
│   └── id.json
└── databases/              # Database storage (optional)
```

## Creating a Command

### Text Command Example

Create a file in `commands/general/mycommand.js`:

```javascript
export default {
  name: "mycommand",
  aliases: ["mc"],
  category: "general",
  description: "My awesome command",
  
  async execute(message, args, client) {
    message.reply("Hello!");
  },
};
```

### Slash Command Example

Create a file in `slashCommands/general/mycommand.js`:

```javascript
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mycommand")
    .setDescription("My awesome command"),

  async execute(interaction, client) {
    interaction.reply("Hello!");
  },
};
```

## Creating an Event

Create a file in `events/category/eventname.js`:

```javascript
export default {
  name: "eventName",
  once: false,
  async execute(...args, client) {
    // Your event logic here
  },
};
```

## Environment Variables

- `TOKEN` - Your Discord bot token
- `CLIENT_ID` - Your bot's application ID
- `GUILD_ID` - (Optional) Guild ID for testing slash commands
- `PREFIX` - Command prefix (default: `!`)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

### Bot won't start
- Check if your token is correct in `.env`
- Make sure Node.js version is 18.0.0 or higher
- Verify all dependencies are installed (`npm install`)

### Slash commands not appearing
- Bot needs to have `applications.commands` scope
- Try using `GUILD_ID` in `.env` for faster testing
- Restart the bot after adding new slash commands

### Commands not working
- Check prefix in `.env`
- Verify bot has necessary permissions in the guild
- Check console for error messages

## Inviting the Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 > URL Generator
4. Select scopes: `bot`, `applications.commands`
5. Select permissions needed
6. Copy the generated URL and open it in browser

## Resources

- [discord.js Documentation](https://discord.js.org/)
- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/applications)

## License

MIT License - Feel free to use this template for your projects!

## Support

For issues and questions, please open an issue on the repository.

---

**Made with ❤️ using discord.js**
