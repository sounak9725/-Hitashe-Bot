const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'deposit',
    description: 'Deposit money into your bank.',
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit money into your bank.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of money to deposit')
                .setRequired(true)),
    async run(client, interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            await User.create({ userId: interaction.user.id, balance: 0, bank: 0 });
        }

        if (amount > user.balance) {
            return interaction.reply('You do not have enough money in hand to deposit.');
        }

        user.balance -= amount;
        user.bank += amount;
        await user.save();

        await interaction.reply(`You have deposited ${amount} coins into your bank. Your balance is now ${user.balance} coins, and your bank balance is ${user.bank} coins.`);
    }
};
