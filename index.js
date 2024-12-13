const { GatewayIntentBits, Client, Partials } = require('discord.js');
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
const fs = require('node:fs');

client.logs = require('./Utils/logs');
client.config = require('./config.json');
if(!client.config.token) return console.log('\x1b[38;5;202mNo token found in config.json, please add your token to the config.json file or alternatively do \x1b[90mnpm run config\x1b[38;5;202m in your terminal\x1b[0m');

const handlers = fs.readdirSync('./Handlers').filter(file => file.endsWith(".js"));
const utils = fs.readdirSync('./Utils/Client').filter(file => file.endsWith(".js"));

for (const file of handlers) {
    require(`./Handlers/${file}`)(client);
}

for (const file of utils) {
    require(`./Utils/Client/${file}`)(client);
}

client.login(client.config.token);