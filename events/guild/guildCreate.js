export default {
  name: "guildCreate",
  async execute(guild, client) {
    console.log(`✅ Bot joined guild: ${guild.name} (${guild.id})`);
    console.log(`📊 Guild members: ${guild.memberCount}`);

    // Send welcome message atau setup
    const defaultChannel = guild.channels.cache.find(
      (channel) => channel.permissionsFor(guild.me).has("SendMessages")
    );

    if (defaultChannel) {
      defaultChannel.send({
        content: `👋 Thank you for inviting me! Type \`${process.env.PREFIX || "!"}help\` to see available commands.`,
      });
    }
  },
};
