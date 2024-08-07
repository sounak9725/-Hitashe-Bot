/* eslint-disable no-undef */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'tictactoe',
    description: 'Play a game of Tic-Tac-Toe with another user!',
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play a game of Tic-Tac-Toe with another user!')
        .addUserOption(option => option.setName('opponent').setDescription('Select your opponent').setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const opponent = interaction.options.getUser('opponent');

        if (interaction.user.id === opponent.id) {
            return interaction.reply({ content: 'You cannot play against yourself!', ephemeral: true });
        }

        const board = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let currentPlayer = interaction.user.id;
        let gameOver = false;

        const buttons = board.map((_, i) =>
            new ButtonBuilder()
                .setCustomId(`tictactoe_${i}`)
                .setLabel(board[i])
                .setStyle(ButtonStyle.Primary)
        );

        const render = () => {
            return new EmbedBuilder()
                .setTitle('Tic-Tac-Toe')
                .setDescription(board.slice(0, 3).join(' ') + '\n' +
                                board.slice(3, 6).join(' ') + '\n' +
                                board.slice(6).join(' '))
                .setFooter({ text: `Current turn: ${currentPlayer === interaction.user.id ? interaction.user.username : opponent.username}` });
        };

        const row1 = new ActionRowBuilder().addComponents(buttons.slice(0, 3));
        const row2 = new ActionRowBuilder().addComponents(buttons.slice(3, 6));
        const row3 = new ActionRowBuilder().addComponents(buttons.slice(6, 9));

        await interaction.reply({ content: `${opponent}, ${interaction.user} has challenged you to a game of Tic-Tac-Toe! React with the buttons to play.`, embeds: [render()], components: [row1, row2, row3] });

        const filter = i => i.customId.startsWith('tictactoe_') && (i.user.id === currentPlayer || i.user.id === opponent.id);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (gameOver) return;

            if (i.user.id !== currentPlayer) {
                return i.reply({ content: 'It\'s not your turn!', ephemeral: true });
            }

            const index = parseInt(i.customId.split('_')[1]);
            if (board[index] === '❌' || board[index] === '⭕') {
                return i.reply({ content: 'This spot is already taken!', ephemeral: true });
            }

            board[index] = currentPlayer === interaction.user.id ? '❌' : '⭕';
            currentPlayer = currentPlayer === interaction.user.id ? opponent.id : interaction.user.id;

            const winner = checkWinner(board);
            if (winner) {
                gameOver = true;
                await i.update({ embeds: [render().setDescription(`${render().data.description}\n**${winner}**`)], components: [] });
            } else if (board.every(cell => cell === '❌' || cell === '⭕')) {
                gameOver = true;
                await i.update({ embeds: [render().setDescription(`${render().data.description}\n**It's a draw!**`)], components: [] });
            } else {
                await i.update({ embeds: [render()] });
            }
        });

        collector.on('end', collected => {
            if (!gameOver) {
                interaction.editReply({ content: 'Game timed out!', components: [] });
            }
        });

        function checkWinner(board) {
            const winConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
                [0, 4, 8], [2, 4, 6]  // Diagonals
            ];

            for (const [a, b, c] of winConditions) {
                if (board[a] !== '1️⃣' && board[a] === board[b] && board[a] === board[c]) {
                    return board[a] === '❌' ? `${interaction.user.username} wins!` : `${opponent.username} wins!`;
                }
            }
            return null;
        }
    }
};
