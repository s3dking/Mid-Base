const { GatewayIntentBits, Client, Partials } = require('discord.js')
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
const { Token } = require('./config.json')
const fs = require('node:fs')
client.logs = require('./Other/logs')
const handlers = fs.readdirSync('./Handlers').filter(file => file.endsWith(".js"))
const utils = fs.readdirSync('./Utils').filter(file => file.endsWith(".js"))
console.log(handlers)
for(const file of handlers) {
    require(`./Handlers/${file}`)(client);
}
for(const file of utils) {
    require(`./Utils/${file}`)(client);
}
client.login(Token)