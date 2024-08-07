const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary

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

        const topUsers = await User.find().sort({ balance: -1 }).limit(10);

        if (topUsers.length === 0) {
            await interaction.editReply({ content: 'No users found in the leaderboard.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setColor('#FFD700');

        for (const [index, user] of topUsers.entries()) {
            const discordUser = await client.users.fetch(user.userId).catch(() => null);
            if (discordUser) {
                embed.addFields({ name: `${index + 1}. ${discordUser.tag}`, value: `Balance: ${user.balance} coins` });
            } else {
                embed.addFields({ name: `${index + 1}. Unknown User`, value: `Balance: ${user.balance} coins` });
            }
        }

        await interaction.editReply({ embeds: [embed] });
    }
};
