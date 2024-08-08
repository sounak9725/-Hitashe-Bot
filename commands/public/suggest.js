// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  name: "suggest",
  description: "Submit a suggestion.",
  data: new SlashCommandBuilder() //
    .setName("suggest")
    .setDescription("Submit a suggestion for improvement or feedback."),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const suggestion_submission = new ModalBuilder({ title: "Suggestion Submission", custom_id: "suggestion_submission" });

    const suggestionInput = new TextInputBuilder({ 
      label: "Your Suggestion", 
      custom_id: "suggestion", 
      min_length: 3, 
      max_length: 2048, 
      style: TextInputStyle.Paragraph 
    });
    
    const additionalInfoInput = new TextInputBuilder({ 
      label: "Additional Information (optional)", 
      custom_id: "additional_info", 
      min_length: 3, 
      max_length: 2048, 
      style: TextInputStyle.Paragraph,
      required: false
    });

    const row1 = new ActionRowBuilder().addComponents(suggestionInput);
    const row2 = new ActionRowBuilder().addComponents(additionalInfoInput);

    suggestion_submission.addComponents(row1, row2);

    await interaction.showModal(suggestion_submission);
  }
};
