/* 
  Developed by Meta (GitHub: https://github.com/2CBS)

  Special thanks to the following resources and communities:
  - Discord.js: A powerful library for interacting with the Discord API.
  - GitHub: For hosting and version control.
  - Node.js: JavaScript runtime environment.

  For any questions or collaboration opportunities, please reach out to Meta on Discord (gnarly.messages).
*/

const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

const warnings = new Map();

client.on("ready", () => {
  console.log("Bot is ready");
});

const embedColor = "fe4e62";

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  const guildOwner = await message.guild.fetchOwner();

  // if (message.author.id === guildOwner.id) {
  //   return; 
  // } else if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
  //   return; 
  // }

  // Regular expression to match various Discord invite link formats
  const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9]{6,}/gi;

  if (discordInviteRegex.test(message.content)) {
    console.log(`Detected Discord Invite Link: ${message.content}`);
    await handleWarning(message, "Discord Invite Link");
    return;
  }

  try {
    const response = await fetch("https://raw.githubusercontent.com/2CBS/LinkProtection/main/suspicious-links.json");
    const data = await response.json();

    for (const domain of data.domains) {
      if (message.content.toLowerCase().includes(domain)) {
        console.log(`Detected Suspicious Link: ${message.content}`);
        await handleWarning(message, "Suspicious Scam Link");
        return;
      }
    }
  } catch (error) {
    console.error("Failed to fetch suspicious links:", error);
  }
});

async function handleWarning(message, reason) {
  const userId = message.author.id;
  const guildId = message.guild.id;

  if (!warnings.has(guildId)) {
    warnings.set(guildId, new Map());
  }

  const guildWarnings = warnings.get(guildId);

  if (!guildWarnings.has(userId)) {
    guildWarnings.set(userId, 0);
  }

  let userWarnings = guildWarnings.get(userId);
  userWarnings += 1;

  const embed = new Discord.MessageEmbed()
    .setTitle("⚠️ Warning Issued")
    .setDescription(
      `**User:** ${message.author.tag} (${message.author.id})\n**Reason:** Posting ${reason}\n**Warning Count:** ${userWarnings}/3\n\nYou have violated the server rules by posting a restricted link. Please refrain from sharing such content. Continued violations may result in further action, including removal from the server.`
    )
    .setColor(embedColor)
    .setTimestamp()
    .setFooter({ text: "Please follow the server rules to avoid further actions." });

  if (userWarnings >= 3) {
    try {
      await message.member.kick("posting restricted links.");
      const kickEmbed = new Discord.MessageEmbed()
        .setTitle("🚫 User Kicked")
        .setDescription(
          `**User:** ${message.author.tag} (${message.author.id})\n**Reason:** Repeatedly posting restricted links.\n**Action:** The user has been kicked from the server to maintain the safety and integrity of our community.\n\nWe strive to create a safe environment for all members. Repeated violations of our rules, especially related to sharing restricted links, cannot be tolerated.`
        )
        .setColor("RED")
        .setTimestamp()
        .setFooter({ text: "This action was taken to maintain the safety and integrity of the server." });

      const kickMessage = await message.channel.send({ embeds: [kickEmbed] });
      setTimeout(() => {
        kickMessage.delete();
      }, 300000); // 5 minute

      console.log(`The member ${message.author.tag} has been kicked from [${message.guild.name}] for posting restricted links`);
    } catch (error) {
      console.error(`Failed to kick ${message.author.tag}:`, error);
    }
    guildWarnings.delete(userId);
  } else {
    guildWarnings.set(userId, userWarnings);
    const warningMessage = await message.channel.send({ embeds: [embed] });
    setTimeout(() => {
      warningMessage.delete();
    }, 300000); // 5 minute

    console.log(`${message.author.tag} has received warning ${userWarnings}/3 in [${message.guild.name}] for posting ${reason}`);
  }

  try {
    await message.delete();
    console.log(`Message from ${message.author.tag} deleted.`);
  } catch (error) {
    console.error(`Failed to delete message from ${message.author.tag}:`, error);
  }
}

client.login(config.token);
