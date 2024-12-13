/*
Credits to musicmaker for this code!
*/

const log = require('../logs.js');

module.exports = function () {

    process.on('SIGINT', () => {
        console.log()
        log.error('[ Manual Kill ] Shutting Down');
        process.reallyExit(1);
    });

    process.on('uncaughtException', (err) => {
        log.error(`[ Uncaught Exception ] \n ${err.stack} `);
    });

    process.on('SIGTERM', () => {
		log.error('[ Sigterm ] Shutting Down');
		process.reallyExit(1);
	});
    process.on('unhandledRejection', (err) => {
		log.error(`[ Unhandled Rejection ] ${err.stack}`);
	});

	process.on('warning', (warning) => {
		log.warn(`[ Warning ] ${warning.name} : ${warning.message}`);
	});

	process.on('uncaughtReferenceError', (err) => {
		log.error(err.stack);
	});

};