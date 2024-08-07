const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary

const cooldowns = new Map(); // Store cooldown timestamps

module.exports = {
    name: 'rob',
    description: 'Attempt to rob another user.',
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to rob another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to rob')
                .setRequired(true)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        const target = interaction.options.getUser('target');
        const userId = interaction.user.id;
        const cooldown = 2 * 60 * 1000; // 2 minutes in milliseconds

        // Check if the user is on cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldown;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply({ content: `You can use this command again in ${timeLeft.toFixed(1)} seconds.`, ephemeral: true });
            }
        }

        // Update the cooldown
        cooldowns.set(userId, Date.now());

        // Fetch the users' balances
        const user = await User.findOne({ userId });
        const targetUser = await User.findOne({ userId: target.id });

        // If target user does not exist in the database
        if (!targetUser) {
            return interaction.reply({ content: 'The target user has no money to rob.', ephemeral: true });
        }

        // Determine if the rob attempt is successful
        const isSuccess = Math.random() > 0.5;
        let amount;

        if (isSuccess) {
            amount = Math.floor(Math.random() * targetUser.balance) + 1; // Random amount to rob
            user.balance += amount;
            targetUser.balance -= amount;

            await user.save();
            await targetUser.save();

            await interaction.reply(`You successfully robbed ${amount} coins from ${target.tag}!`);
        } else {
            amount = Math.floor(Math.random() * user.balance) + 1; // Random amount to lose
            user.balance -= amount;

            await user.save();

            await interaction.reply(`You failed to rob ${target.tag} and lost ${amount} coins!`);
        }
    }
};
