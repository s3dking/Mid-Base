const mongoose = require('mongoose')
const { MongoDB } = require('../config.json')

module.exports = function (client) {
	const Log = require('../Other/logs.js');

	if (!MongoDB) return Log.warn('A MongoDB Link was not detected in your login.config. There may be an issue with your link.');

    const connect = mongoose.connect(MongoDB);

    if (connect) {
        client.on('ready', (x) => {
            Log.login(`${x.user.tag}'s Connection To Your MongoDB Cluster Was Successful`);
        })
    }

}