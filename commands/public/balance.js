const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
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
            const noBalanceEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('No Balance Found')
                .setDescription('You do not have any balance yet. Use /work to earn some coins.')
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [noBalanceEmbed], ephemeral: true });
        } else {
            const balanceEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Your Balance')
                .setDescription(`Your balance is **${user.balance}** coins. Your bank balance is **${user.bank}** coins. Use /deposit to deposit the balance in the bank and keep your money safe from robbers! :3`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [balanceEmbed], ephemeral: false });
        }
    }
};
