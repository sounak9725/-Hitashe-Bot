// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { interactionEmbed } = require("../../functions.js");
const { default: fetch } = require("node-fetch");
const nbx = require("noblox.js");

module.exports = {
  name: "profile",
  description: "Gives you back the profile details.",
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Gives you back the profile details")
    .addStringOption(option => {
      return option
        .setName("roblox_user")
        .setDescription("Roblox username")
        .setRequired(true);
    }),
    
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */
  run: async (client, interaction, options) => {
    //await interaction.deferReply();
    const username = await interaction.options.getString("roblox_user");
    let id;
    try {
      id = await nbx.getIdFromUsername(username);
    } catch (error) {
      return interactionEmbed(3, "[ERR-ARGS]", `Interpreted \`${options.getString("roblox_user")}\` as username but found no user`, interaction, client, [true, 30]);
    }

    const info = await nbx.getPlayerInfo(id);
    const avatar = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=720x720&format=Png&isCircular=false`)
      .then(r => r.json())
      .then(r => r.data[0].imageUrl);
        
    const embed = new EmbedBuilder({
      title: `${info.username.toString()}'s Profile`,
      thumbnail: {
        url: avatar
      },
      fields: [
        {
          name: "Username:",
          value: `[${info.username}](https://www.roblox.com/users/${id}/profile)`,
          inline: false
        },
        {
          name: "Description:",
          value: String(info.blurb || "No Description"),
          inline: false
        },
        {
          name: "Friends:",
          value: String(info.friendCount),
          inline: true
        },
        {
          name: "Following:",
          value: String(info.followingCount),
          inline: true
        },
        {
          name: "Followers:",
          value: String(info.followerCount),
          inline: true
        },
        {
          name: "Banned from roblox?",
          value: `User \`${options.getString("roblox_user")}\`'s ban status from roblox is:` +  `\`${Boolean(info.isBanned)}\``,
          inline: false
        },
        {
          name: "Previous Usernames:",
          value: info.oldNames.toString() <= 0 ? "N/A": info.oldNames.toString(),
          inline: false
        },
        {
          name: "Account Age:",
          value: String(info.age),
          inline: false
        },
        {
          name: "Join Date:",
          value: String(info.joinDate),
          inline: false
        }
      ],
      footer: {
        text: `Requested by ${interaction.member.user.username}`,
        iconUrl: interaction.user.displayAvatarURL()
      },
      timestamp: new Date()
    })
      .setColor(Colors.Aqua);
      
    interaction.reply({embeds : [embed]});
  }
};