const log = require('../../Utils/logs.js');
const config = require('../../config.json')
const prefix = config.prefix

module.exports = {
    event: 'messageCreate',
    once: false,
    
    async execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot ) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        const command = client.prefix.get(commandName);
        const devCommand = client.prefixDev.get(commandName); // Changed from devPrefix to prefixDev
    
        // If neither command exists
        if (!command && !devCommand) {
            return message.reply('Command not found');
        }

        // Check if it's a regular command before accessing its properties
        if (command) {
            if (command.users && !command.users.includes(message.author.id)) {
                const user = await client.users.fetch(command.users[0]);
                return await message.reply({ content: `This command can only be run by ${user.username}`, ephemeral: true });
            }

            if (command.guilds && !command.guilds.includes(message.guild.id)) {
                return message.reply({ content: `This command cannot be run in this guild ( this is set by the developer of the bot )`, ephemeral: true });
            }

            if (client.config.blacklistedUserIds.includes(message.author.id)) {
                return message.reply({ content: `You are blacklisted from using this bot`, ephemeral: true });
            }

            if (command.blacklisted && command.blacklisted.includes(message.author.id)) {
                return message.reply({ content: `You are blacklisted from using this command`, ephemeral: true });
            }

            if (command.permissions) {
                const permissions = message.member.permissions.has(command.permissions);
                if (!permissions) {
                    return message.reply({ content: `You do not have the required permissions to run this command! ( ${command.permissions} )`, ephemeral: true });
                }
            }

            if (command.cooldown) {
                if (!client.cooldowns) client.cooldowns = new Map();
                const { cooldowns } = client;
                if (!cooldowns.has(commandName)) {
                    cooldowns.set(commandName, new Map());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(commandName);
                const cooldownAmount = (command.cooldown) * 1000;

                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply({ 
                            content: `Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${commandName}\` command again.`, 
                            ephemeral: true 
                        });
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }
    
        try {
            if (command.dev === true && message.guild?.id !== client.config.devguildID) {
                await message.reply('This command is only available in the development guild')
                client.logs.warn(`Dev Command ( ${commandName} ) attempted to be executed by ${message.author.tag} outside of the development guild`);
            } else if (command) {
                await command.execute(message, args, client);
                log.prefix(`Command ( ${commandName} ) executed by ${message.author.tag}`);
                if (client.config.cmdLogChannel) {
                    const channel = client.channels.cache.get(client.config.cmdLogChannel);
                    if (!channel) return console.error(`The channel ID '${client.config.cmdLogChannel}' does not exist!`);
                    const embed = {
                        color: 0x00d75f,
                        title: 'Command Executed',
                        description: `Command ( **${commandName}** ) executed by **${message.author.tag}**`,
                        timestamp: new Date(),
                        footer: {
                            text: 'Command Executed In ' + message.guild.name,
                        }
                    }
                    channel.send({ embeds: [embed] }).catch(console.error);
            }
        }
        } catch (error) {
            console.error(error);
            message.reply(`There was an error while executing this command!\n\`\`\`\n${error.stack}\n\`\`\``);
        }
    }
};