export default {
  name: "guildDelete",
  execute(guild) {
    console.log(`❌ Bot removed from guild: ${guild.name} (${guild.id})`);
  },
};
