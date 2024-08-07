const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Displays information about a user.',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to get information about').setRequired(true)),
     /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */        
    async run(client, interaction, options) {
        const target = interaction.options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id);

        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(', ');

        const embed = new EmbedBuilder()
            .setTitle(`User Info: ${target.tag}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: target.id, inline: true },
                { name: 'Username', value: target.username, inline: false },
                { name: 'Nickname', value: member.nickname || 'None', inline: false },
                { name: 'Joined Discord', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: false },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: 'Roles', value: roles || 'None', inline: false }
            )
            .setColor('Blurple')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
