const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const User = require('../../models/User'); // Adjust path as necessary

module.exports = {
    name: 'balance',
    description: 'Check your balance!',
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your balance.'),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            await interaction.reply({ content: 'You do not have any balance yet. Use /work to earn some coins.', ephemeral: false });
        } else {
            await interaction.reply({ content: `Your balance is **${user.balance}** coins. Your bank balance is **${user.bank}**. Use /deposit to deposit the balance in the bank and keep your money safe from robbers! :3`, ephemeral: false });
        }
    }
};
