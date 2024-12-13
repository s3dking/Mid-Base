module.exports = {
    event: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isContextMenuCommand()) return;

        const command = client.context.get(interaction.commandName) || client.devContext.get(interaction.commandName);
        if (!command) return;

        // Check if it's a dev command and if it's being used in the dev guild
        if (client.devContext.has(interaction.commandName) && interaction.guild.id !== client.config.devguildID) {
            return interaction.reply({ 
                content: 'This command can only be used in the development server!', 
                ephemeral: true 
            });
        }

        if (command.cooldown) {
            const { cooldowns } = client;
            if (!cooldowns.has(interaction.commandName)) {
                cooldowns.set(interaction.commandName, new Map());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(interaction.commandName);
            const cooldownAmount = (command.cooldown) * 1000;

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

        if (command.guilds && !command.guilds.includes(interaction.guild.id)) {
            return interaction.reply({ content: `This command cannot be run in this guild ( this is set by the developer of the bot )`, ephemeral: true });
        }

        if (client.config.blacklistedUserIds.includes(interaction.user.id)) {
            return interaction.reply({ content: `You are blacklisted from using this bot`, ephemeral: true });
        }

        if (command.blacklisted && command.blacklisted.includes(interaction.user.id)) {
            return interaction.reply({ content: `You are blacklisted from using this command`, ephemeral: true });
        }

        if (command.users) {
            if (!command.users.includes(interaction.user.id)) {
                const user = client.users.cache.get(command.users[0]);
                return interaction.reply({ content: `This command can only be run by ${user.username}`, ephemeral: true });
            }
        }

        if (command.permissions) {
            const permissions = interaction.member.permissions.has(command.permissions);
            if (!permissions) {
                return interaction.reply({ content: `You do not have the required permissions to run this command! ( ${command.permissions} )`, ephemeral: true });
            }
        }

        try {
            await command.execute(interaction, client);
            client.logs.context(`Command ( ${interaction.commandName} ) executed by ${interaction.user.tag}`);
            if (client.config.cmdLogChannel) {
                const channel = client.channels.cache.get(client.config.cmdLogChannel);
                if (!channel) return console.error(`The channel ID '${client.config.cmdLogChannel}' does not exist!`);
                const embed = {
                    color: 0xff005f,
                    title: 'Context Command Executed',
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
        }
    },
};