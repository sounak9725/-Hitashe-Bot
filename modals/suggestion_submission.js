// eslint-disable-next-line no-unused-vars
const { Client, ModalSubmitInteraction, ModalSubmitFields, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "suggestion_submission",
  /**
   * @param {Client} client
   * @param {ModalSubmitInteraction} interaction
   * @param {ModalSubmitFields} fields
   */
  run: async (client, interaction, fields) => {
    const embed = new EmbedBuilder({
      title: "New Suggestion",
      color: 0x00FF00,
      fields: [
        {
          name: "Submitter",
          value: `<@${interaction.user.id}> (${interaction.user.tag})`,
          inline: false
        },
        {
          name: "Suggestion",
          value: fields.getTextInputValue("suggestion"),
          inline: false
        },
        {
          name: "Additional Information",
          value: fields.getTextInputValue("additional_info"),
          inline: false
        }
      ],
      footer: {
        text: `Suggestion submitted at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
        iconURL: client.user.displayAvatarURL()
      }
    });

    await client.channels.cache.get("1287407821998129254").send({ content: `<@&1232709447571214447> New suggestion from ${interaction.user.tag} (${interaction.user.id})`, embeds: [embed] });
    interaction.user.send({ content: "Thank you for your suggestion!", embeds: [embed] });
    return interaction.reply({ content: "Suggestion submitted! 📤", embeds: [embed], ephemeral: true });
  }
};
