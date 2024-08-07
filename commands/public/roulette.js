const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary

module.exports = {
    name: 'roulette',
    description: 'Play a game of Roulette!',
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Play a game of Roulette.')
        .addIntegerOption(option => 
            option.setName('bet')
                .setDescription('Amount to bet')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('betting_on')
                .setDescription('What are you betting on? (e.g., color or number)')
                .setRequired(true)
                .addChoices([
                    { name: 'Red', value: 'red' },
                    { name: 'Black', value: 'black' },
                    { name: 'Odd', value: 'odd' },
                    { name: 'Even', value: 'even' }
                ])),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        const bet = interaction.options.getInteger('bet');
        const bettingOn = interaction.options.getString('betting_on');
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            await interaction.reply({ content: 'User not found in database.', ephemeral: true });
            return;
        }

        if (user.balance < bet) {
            await interaction.reply({ content: 'You do not have enough balance to place this bet.', ephemeral: true });
            return;
        }

        // Simulate a roulette spin
        const result = Math.floor(Math.random() * 37); // 0-36 for European Roulette
        const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result);
        const isOdd = result % 2 !== 0;
        const isWinning = (
            (bettingOn === 'red' && isRed) ||
            (bettingOn === 'black' && !isRed && result !== 0) ||
            (bettingOn === 'odd' && isOdd) ||
            (bettingOn === 'even' && !isOdd && result !== 0)
        );

        let resultMessage = `The ball landed on **${result}**.`;
        let outcomeMessage = isWinning ? 'Congratulations, you won!' : 'Sorry, you lost. Better luck next time!';
        if (isWinning) {
            user.balance += bet;
        } else {
            user.balance -= bet;
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setTitle('Roulette')
            .setColor(isWinning ? '#00FF00' : '#FF0000')
            .setDescription(resultMessage)
            .addFields(
                { name: 'Your Bet', value: bettingOn, inline: true },
                { name: 'Outcome', value: outcomeMessage, inline: true },
                { name: 'Your Balance', value: `${user.balance} coins`, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
