module.exports = (client) => {
    require('../Handlers/SlashHandler.js')(client)
    require('../Handlers/ComponentHandler.js')(client)
    require('./AntiCrash.js')(client)
    require('./FileTemplate.js')(client)
    require('../Handlers/EventHandler.js')(client)
    require('../Handlers/PrefixHandler.js')(client)
    require('./MongoConnection.js')(client)
}