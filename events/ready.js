const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const { ProLogs } = require("resthaven")

const lg = new ProLogs()

const config = require("../config.json");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  allowedMentions: {
    parse: ["users"]
  },
  partials: Object.values(Partials),
  retryLimit: 3
});

/**
 * @param {import('discord.js').Client} client
 */

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(config.API.token || process.env.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }


  lg.success(`${client.user.username} isimli bot giriş yaptı.`)


};