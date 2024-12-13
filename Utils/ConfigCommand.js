const{GatewayIntentBits,Client,Partials}=require('discord.js')
const client=new Client({intents:Object.keys(GatewayIntentBits),partials:Object.keys(Partials)});client.logs=require('./logs.js')
require('./ConfigTerminal.js')(client)