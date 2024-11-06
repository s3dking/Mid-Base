const { GatewayIntentBits, Client, Partials } = require('discord.js')
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
const { Token } = require('../config.json')
require('../Utils/ClientPassing.js')(client)
client.login(Token)