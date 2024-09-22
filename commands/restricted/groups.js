// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { interactionEmbed, paginationEmbed } = require("../../functions.js");
const nbx = require("noblox.js");

module.exports = {
  name: "groups",
  description: "Shows all the groups that the user is in",
  data: new SlashCommandBuilder()
    .setName("groups")
    .setDescription("Shows all the groups that the user is in")
    .addStringOption(option => {
      return option
        .setName("username")
        .setDescription("Use a roblox username")
        .setRequired(true);
    }),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */
  run: async (client, interaction, options) => {
    await interaction.deferReply();
    const robloxuser = options.getString("username");
    let robloxid;
    try {
      robloxid = await nbx.getIdFromUsername(robloxuser);
    } catch (error) {
      return interactionEmbed(3, "[ERR-ARGS]", `Interpreted \`${options.getString("username")}\` as username but found no user`, interaction, client, [true, 15]);
    }

    const groups = await nbx.getGroups(robloxid);
    let embed1 = new EmbedBuilder().setTitle(`**${robloxuser}**'s Groups:`);
    let embed2 = new EmbedBuilder();
    let embed3 = new EmbedBuilder();
    let embed4 = new EmbedBuilder();
    let embed5 = new EmbedBuilder();
    let pages = [];
    for (const [key, value] of Object.entries(groups)) {
      let groupname = value.Name;
      let grouprank = value.Role;
      if (key >= 80) {
        embed5.addFields({ name: `${groupname}`, value: `${grouprank}`, inline: true });
        if (!pages.includes(embed5)) pages.push(embed5);
      } else if (key >= 60) {
        embed4.addFields({ name: `${groupname}`, value: `${grouprank}`, inline: true });
        if (!pages.includes(embed4)) pages.push(embed4);
      } else if (key >= 40) {
        embed3.addFields({ name: `${groupname}`, value: `${grouprank}`, inline: true });
        if (!pages.includes(embed3)) pages.push(embed3);
      } else if (key >= 20) {
        embed2.addFields({ name: `${groupname}`, value: `${grouprank}`, inline: true });
        if (!pages.includes(embed2)) pages.push(embed2);
      } else {
        embed1.addFields({ name: `${groupname}`, value: `${grouprank}`, inline: true });
        if (!pages.includes(embed1)) pages.push(embed1);
      }
    }
    if (groups.length == 0) {
      return interactionEmbed(3, "[ERR-MISS]", `**${robloxuser}** is not in any group.`, interaction, client, [true, 15]);
    }
    paginationEmbed(interaction, pages);
  }
};