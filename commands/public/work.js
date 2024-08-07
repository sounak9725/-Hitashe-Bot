const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary

// In-memory cooldown store
const cooldowns = new Map();

module.exports = {
    name: 'work',
    description: 'Earn money by working!',
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Earn money by working.'),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        const cooldownTime = 40 * 1000; // 40 seconds in milliseconds
        const userId = interaction.user.id;

        // Check if user is in cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownTime;
            const remainingTime = expirationTime - Date.now();

            if (remainingTime > 0) {
                const remainingSeconds = Math.ceil(remainingTime / 1000);
                const cooldownEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Cooldown')
                    .setDescription(`You need to wait ${remainingSeconds} more seconds before using the /work command again.`)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();

                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }
        }

        // Set the cooldown
        cooldowns.set(userId, Date.now());

        let user = await User.findOne({ userId });

        if (!user) {
            user = await User.create({ userId, balance: 0 });
        }

        const baseAmount = Math.floor(Math.random() * 100) + 1; // Base amount for demo purposes
        let bonus = 0;

        // Define role IDs and their respective bonuses
        const roleBonuses = {
            '1270705630185001010': 10, // Replace ROLE_ID_1 with the actual role ID
            '1270705578351788156': 20, // Replace ROLE_ID_2 with the actual role ID
            // Add more roles and bonuses as needed
        };

        // Check if the user has any of the roles and add the corresponding bonus
        interaction.member.roles.cache.forEach(role => {
            if (roleBonuses[role.id]) {
                bonus += roleBonuses[role.id];
            }
        });

        const totalAmount = baseAmount + bonus;
        user.balance += totalAmount;
        await user.save();

        const workEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Work Result')
            .setDescription(`You worked hard and earned ${baseAmount} coins!\nYour bonus is ${bonus} coins.\nYour total balance is now ${user.balance} coins.`)
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [workEmbed] });

        // Clean up the cooldown entry after the cooldown time has passed
        setTimeout(() => cooldowns.delete(userId), cooldownTime);
    }
};
