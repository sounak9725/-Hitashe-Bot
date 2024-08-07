/* eslint-disable no-undef */
const { SlashCommandBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
    name: 'rockpaperscissors',
    description: 'Play Rock, Paper, Scissors with another user.',
    data: new SlashCommandBuilder()
        .setName('rockpaperscissors')
        .setDescription('Play Rock, Paper, Scissors.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to play against')
                .setRequired(true)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {CommandInteractionOptionResolver} options
    */
    run: async (client, interaction, options) => {
        //const opponent = interaction.options.getUser('user');
        
        // Check if the opponent is the same as the user
        // if (opponent.id === interaction.user.id) {
        //     return interaction.reply({ content: 'You cannot play against yourself!', ephemeral: true });
        // }

        const Game = new RockPaperScissors({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('user'),
            embed: {
                title: 'Rock Paper Scissors',
                color: '#5865F2',
                description: 'Press a button below to make a choice.'
            },
            buttons: {
                rock: 'Rock',   
                paper: 'Paper',
                scissors: 'Scissors'
            },
            emojis: {
                rock: '🌑',
                paper: '📰',
                scissors: '✂️'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'You chose {emoji}.',
            winMessage: '**{player}** won the Game! Congratulations!',
            tieMessage: 'The Game tied! No one won the Game!',
            timeoutMessage: 'The Game went unfinished! No one won the Game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            console.log(result);  // Logs the result of the game
        });

        //await interaction.reply('The game of Rock, Paper, Scissors has started!');
    }
};
