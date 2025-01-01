const { EmbedBuilder } = require("discord.js");

const config = require("../config.json");
const db = require("../db.js");

module.exports = {
  name: "ping",
  description: "Milisaniye gecikme değerlerini gösterir.",
  options: [],
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
   
    
    interaction.reply({ content: `Pong! **${client.ws.ping}ms.**` })


  },
};