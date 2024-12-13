const log = require('../../Utils/logs.js')

module.exports = {
    event: 'interactionCreate',
    once: false,
    
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (interaction.isContextMenuCommand()) return;

        // Check both regular and dev commands
        let Commands = client.commands.get(interaction.commandName);
        if (!Commands) {
            Commands = client.devCommands.get(interaction.commandName);
        }
        
        if (!Commands) {
            return interaction.reply({ 
                content: `Command \`${interaction.commandName}\` was not found.`, 
                ephemeral: true 
            });
        }

        // Initialize cooldowns if it doesn't exist
        if (!client.cooldowns) client.cooldowns = new Map();
        
        if(Commands.users) {
            if(!Commands.users.includes(interaction.user.id)) {
                const user = client.users.cache.get(Commands.users[0]);
                return interaction.reply({ content: `This command can only be run by ${user.username}`, ephemeral: true });
        }
    }

        if (Commands.guilds && !Commands.guilds.includes(interaction.guild.id)) {
        return interaction.reply({ content: `This command cannot be run in this guild ( this is set by the developer of the bot )`, ephemeral: true });
        }
 
        if (Commands.Permissions) {
            const permissions = interaction.member.permissions.has(Commands.Permissions);
            if (!permissions) {
                return interaction.reply({ content: `You do not have the required permissions to run this command! ( ${Commands.Permissions} )`, ephemeral: true });
            }
        }

        if (client.config.blacklistedUserIds.includes(interaction.user.id)) {
            return interaction.reply({ content: `You are blacklisted from using this bot`, ephemeral: true });
        }

        if (Commands.blacklisted && Commands.blacklisted.includes(interaction.user.id)) {
            return interaction.reply({ content: `You are blacklisted from using this command`, ephemeral: true });
        }

        if (Commands.cooldown) {
            const { cooldowns } = client;
            if (!cooldowns.has(interaction.commandName)) {
                cooldowns.set(interaction.commandName, new Map());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(interaction.commandName);
            const cooldownAmount = (Commands.cooldown) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ 
                        content: `Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${interaction.commandName}\` command again.`, 
                        ephemeral: true 
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        }

        try {
            await Commands.execute(interaction, client);
            log.slash(`Command ( ${interaction.commandName} ) executed by ${interaction.user.tag}`);
            if (client.config.cmdLogChannel) {
                const channel = client.channels.cache.get(client.config.cmdLogChannel);
                if (!channel) return console.error(`The channel ID '${client.config.cmdLogChannel}' does not exist!`);
                const embed = {
                    color: 0x00ffff,
                    title: 'Command Executed',
                    description: `Command ( **${interaction.commandName}** ) executed by **${interaction.user.username}**`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Command Executed In ' + interaction.guild.name,
                    }
                }
                channel.send({ embeds: [embed] }).catch(console.error);
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `There was an error while executing this command!\n\`\`\`\n${error}\n\`\`\``, 
                    ephemeral: true 
                }).catch(console.error);
            }
        }
    }
};