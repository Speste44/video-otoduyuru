const { Client, Partials, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { readdirSync } = require("fs")
const config = require("./config.json");
const axios = require("axios")

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    allowedMentions: {
        parse: ["everyone", "roles", "users"]
    },
    partials: Object.values(Partials),
    retryLimit: 3
});

/**
* @param {import('discord.js').Client} client
*/

global.client = client;
client.commands = (global.commands = []);

readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: props.dm_permission,
        type: 1
    });
});

readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
});


client.login(config.API.token || process.env.token)

let lastVideoId = "";

async function checkForNewVideos() {
    try {

        console.log("Yeni video kontrolu sağlanıyor..")

        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search`,
            {
                params: {
                    part: "snippet",
                    channelId: config.API.channelId,
                    order: "date",
                    maxResults: 1,
                    type: "video",
                    key: config.API.youtubeApiKey
                }
            }
        );

        const video = response.data.items[0];

        if (video && video.id.videoId !== lastVideoId) {
            lastVideoId = video.id.videoId;
            const discordChannel = await client.channels.fetch(config.API.discordChannelId);

            if (discordChannel) {
                await discordChannel.send(
                    `📢 Yeni video yüklendi: **${video.snippet.title}**\nhttps://www.youtube.com/watch?v=${video.id.videoId} @everyone & @here`
                );
            }
        }
    } catch (error) {
        console.error("You:", error);
    }
}

client.once("ready", () => {

    checkForNewVideos()

    setInterval(checkForNewVideos,  60 * 5 * 1000);
});


process.on("unhandledRejection", (error) => {
    console.log(error);
});
process.on("uncaughtException", (err) => {
    console.log(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
    console.log(err);
});