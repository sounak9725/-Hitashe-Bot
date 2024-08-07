const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'withdraw',
    description: 'Withdraw money from your bank.',
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank.')
        .addStringOption(option => 
            option.setName('amount')
                .setDescription('The amount of money to withdraw or type "all" to withdraw everything')
                .setRequired(true)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        const amountOption = interaction.options.getString('amount');
        let user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            user = await User.create({ userId: interaction.user.id, balance: 0, bank: 0 });
        }

        let amount;
        if (amountOption.toLowerCase() === 'all') {
            amount = user.bank;
        } else {
            amount = parseInt(amountOption);
            if (isNaN(amount)) {
                const invalidAmountEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Invalid Amount')
                    .setDescription('Please enter a valid number or "all".')
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();
                return interaction.reply({ embeds: [invalidAmountEmbed], ephemeral: true });
            }
        }

        if (amount > user.bank) {
            const insufficientFundsEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Insufficient Funds')
                .setDescription('You do not have enough money in the bank to withdraw.')
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [insufficientFundsEmbed], ephemeral: true });
        }

        user.balance += amount;
        user.bank -= amount;
        await user.save();

        const withdrawEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Withdrawal Successful')
            .setDescription(`You have withdrawn ${amount} coins from your bank.\nYour balance is now ${user.balance} coins, and your bank balance is ${user.bank} coins.`)
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [withdrawEmbed] });
    }
};
