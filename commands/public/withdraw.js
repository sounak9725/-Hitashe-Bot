const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'withdraw',
    description: 'Withdraw money from your bank.',
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of money to withdraw')
                .setRequired(true)),
    async run(client, interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            await User.create({ userId: interaction.user.id, balance: 0, bank: 0 });
        }

        if (amount > user.bank) {
            return interaction.reply('You do not have enough money in the bank to withdraw.');
        }

        user.balance += amount;
        user.bank -= amount;
        await user.save();

        await interaction.reply(`You have withdrawn ${amount} coins from your bank. Your balance is now ${user.balance} coins, and your bank balance is ${user.bank} coins.`);
    }
};
