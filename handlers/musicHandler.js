import { Player } from "discord-player";

/**
 * Initialize Discord Player
 */
export async function initializePlayer(client) {
  const player = new Player(client, {
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 300000,
    deafenOnJoin: true,
  });

  // Initialize player
  await player.extractors.loadDefault();

  console.log("✅ Music extractors loaded successfully");

  // Emitters
  player.events.on("error", (queue, error) => {
    console.error(`❌ Music Player Error:`, error.message);
    const channel = queue?.metadata?.channel;
    if (channel) {
      channel.send("❌ An error occurred in the music player!").catch(() => {});
    }
  });

  player.events.on("connectionError", (queue, error) => {
    console.error(`❌ Connection Error:`, error.message);
    const channel = queue?.metadata?.channel;
    if (channel) {
      channel
        .send("❌ Failed to connect to voice channel!")
        .catch(() => {});
    }
  });

  player.events.on("trackStart", (queue, track) => {
    const channel = queue.metadata.channel;
    if (channel) {
      channel.send({
        content: `🎵 Now playing: **${track.title}** by **${track.author}**`,
      });
    }
  });

  player.events.on("trackEnd", (queue, track) => {
    console.log(`✅ Track ended: ${track.title}`);
  });

  player.events.on("queueEnd", (queue) => {
    const channel = queue.metadata.channel;
    if (channel) {
      channel.send({
        content: "✅ Queue ended. No more songs to play!",
      });
    }
  });

  return player;
}
