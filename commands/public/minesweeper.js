const { Minesweeper } = require('discord-gamecord');
const { SlashCommandBuilder, Client, CommandInteraction, Colors } = require('discord.js');

module.exports = {
    name: 'minesweeper',
    description: 'Play a game of Minesweeper.',
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('Play a game of Minesweeper.'),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    run: async (client, interaction, message) => {  
    const Game = new Minesweeper({
     message: interaction,
  isSlashGame: true,
  embed: {
    title: 'Minesweeper',
    color: 'Red',
    description: 'Click on the buttons to reveal the blocks except mines.'
  },
  emojis: { flag: '🚩', mine: '💣' },
  mines: 5,
  timeoutTime: 60000,
  winMessage: 'You won the Game! You successfully avoided all the mines.',
  loseMessage: 'You lost the Game! Beaware of the mines next time.',
  playerOnlyMessage: 'Only {player} can use these buttons.'
    });

    Game.startGame();
    Game.on('gameOver', result => {
    console.log(result);  // =>  { result... }
    });
   
    }
}