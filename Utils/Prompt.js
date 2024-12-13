/*
   _____ ____  _____  ______    __          _______  _____ _______ _______ ______ _   _     ______     __    __  __ _    _  _____ _____ _____ __  __          _  ________ _____  
  / ____/ __ \|  __ \|  ____|   \ \        / /  __ \|_   _|__   __|__   __|  ____| \ | |   |  _ \ \   / /   |  \/  | |  | |/ ____|_   _/ ____|  \/  |   /\   | |/ /  ____|  __ \ 
 | |   | |  | | |  | | |__       \ \  /\  / /| |__) | | |    | |     | |  | |__  |  \| |   | |_) \ \_/ /    | \  / | |  | | (___   | || |    | \  / |  /  \  | ' /| |__  | |__) |
 | |   | |  | | |  | |  __|       \ \/  \/ / |  _  /  | |    | |     | |  |  __| | . ` |   |  _ < \   /     | |\/| | |  | |\___ \  | || |    | |\/| | / /\ \ |  < |  __| |  _  / 
 | |___| |__| | |__| | |____       \  /\  /  | | \ \ _| |_   | |     | |  | |____| |\  |   | |_) | | |      | |  | | |__| |____) |_| || |____| |  | |/ ____ \| . \| |____| | \ \ 
  \_____\____/|_____/|______|       \/  \/   |_|  \_\_____|  |_|     |_|  |______|_| \_|   |____/  |_|      |_|  |_|\____/|_____/|_____\_____|_|  |_/_/    \_\_|\_\______|_|  \_\
*/



module.exports = async function Prompt(question = '') {
    if (typeof question !== 'string') throw new Error('Question must be a string');

	process.stdin.resume();

    return new Promise(resolve => {
        const onData = (data = Buffer.from('')) => {
			data = data.toString().trim();
			process.stdin.off('data', onData);
			process.stdin.pause();
			resolve(data);
        }
        process.stdin.on('data', onData);
		if (question) process.stdout.write(question);
    })
}