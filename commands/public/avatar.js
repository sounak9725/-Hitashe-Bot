const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'To show people\'s avatar',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows the avatar of a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to get the avatar of')
                .setRequired(true)),
    /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */            
    async run(client, interaction) {
        // Get the user from the options
        const user = interaction.options.getUser('user');
        
        // Create the embed with the user's avatar
        const avatarEmbed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()
            .setFooter({ text: 'Requested by ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
        
        // Send the embed to the channel
        await interaction.reply({ embeds: [avatarEmbed] });
    }
};
