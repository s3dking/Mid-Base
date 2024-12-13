const fs = require('node:fs')
const path = require('node:path')
const Prompt = require('./Prompt.js')
const config = require('../config.json')

module.exports = async function () {

    //Token Prompt
    const tokenPrompt = await Prompt('\x1b[38;5;45mEnter your discord bot\'s Token!: \x1b[0m');
    config.token = tokenPrompt;
    fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2))
    console.log(`\x1b[38;5;10mSuccesfully entered your bots token into config.json ( ${tokenPrompt} ) \n \n\x1b[0m`)

    //Prefix Prompt
    const prefix = await Prompt('\x1b[38;5;45mWould you like a prefix? (Y/N): \x1b[0m');
    if (prefix.toLowerCase() === 'y') {
        const prefixPrompt = await Prompt('\n\x1b[38;5;11mEnter your discord bot\'s Prefix: \x1b[0m');
        config.prefix = prefixPrompt;
        fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2))
        console.log(`\x1b[38;5;10mSuccesfully entered your bots prefix into config.json ( ${prefixPrompt} )\n \n\x1b[0m`)
    }

    //Dev Guild Id Prompt
    const devGuildId = await Prompt('\x1b[38;5;45mWould you like to set a Development Guild ID? (Y/N): \x1b[0m');
    if (devGuildId.toLowerCase() === 'y') {
        const devGuildIdPrompt = await Prompt('\n\x1b[38;5;11mEnter your discord bot\'s Development Guild ID: \x1b[0m');
        config.devguildID = devGuildIdPrompt;
        fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2))
        console.log(`\x1b[38;5;10mSuccesfully entered your bots Dev Guild ID into config.json ( ${devGuildIdPrompt} )\n \n\x1b[0m`)
    }

    //command logging Prompt
    const commandLogging = await Prompt('\x1b[38;5;45mWould you like to enable command logging? (Y/N): \x1b[0m');
    if (commandLogging.toLowerCase() === 'y') {
        const commandLogging = await Prompt('\n\x1b[38;5;11mEnter your discord bot\'s Command Logging Channel ID: \x1b[0m');
        config.cmdLogChannel = commandLogging;
        fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2))
        console.log(`\x1b[38;5;10mCommand logging has been enabled in config.json\n \n\x1b[0m`)
    }
}