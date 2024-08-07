const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary
const { paginationEmbed } = require('../../functions.js');

module.exports = {
    name: 'leaderboard',
    description: 'Check the leaderboard!',
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Check the leaderboard.'),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        await interaction.deferReply(); // Defer the reply to give time for processing

        const topUsers = await User.find().sort({ balance: -1 }).limit(30); // Fetch top 30 users for demonstration

        if (topUsers.length === 0) {
            await interaction.editReply({ content: 'No users found in the leaderboard.', ephemeral: true });
            return;
        }

        const embeds = [];
        const usersPerPage = 10;

        for (let i = 0; i < topUsers.length; i += usersPerPage) {
            const currentUsers = topUsers.slice(i, i + usersPerPage);
            const embed = new EmbedBuilder()
                .setTitle('Leaderboard')
                .setColor('#FFD700');

            currentUsers.forEach((user, index) => {
                const discordUser = client.users.cache.get(user.userId);
                const username = discordUser ? discordUser.tag : 'Unknown User';
                embed.addFields({
                    name: `${i + index + 1}. ${username}`,
                    value: `Balance: ${user.balance} coins\nBank Balance: ${user.bank} coins`
                });
            });

            embeds.push(embed);
        }

        paginationEmbed(interaction, embeds);
    }
};
