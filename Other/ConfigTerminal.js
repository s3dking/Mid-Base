const fs = require('node:fs')
const configfile = require('../config.json')

module.exports = (client) => {
try{
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Enter your discord bot\'s Token! \n \n', token => {
        console.log(`Succesfully entered your bots token into config.json ( ${token} ) \n \n`)
        configfile.Token = token;
        fs.writeFileSync('config.json', JSON.stringify(configfile, null, 2))

        readline.question('Enter your discord bot\'s Application ID! \n \n', appid => {
            console.log(`Succesfully entered your bots application id into config.json ( ${appid} ) \n \n`)
            configfile.ClientID = appid;
            fs.writeFileSync('config.json', JSON.stringify(configfile, null, 2))

            readline.question('Enter your discord bot\'s Prefix \n \n', prefix => {
                console.log(`Succesfully entered your bots prefix into config.json ( ${appid} )\n \n`)
                configfile.prefix = prefix;
                fs.writeFileSync('config.json', JSON.stringify(configfile, null, 2))
                readline.close()
                client.logs.success(`All questions have been answered and everything has been put in your config.json file`)
            });
        });
    });

} catch(err) {
    client.logs.error(err)
}
}