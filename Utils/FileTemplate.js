const fs = require('fs');
const path = require('path');
const console = require('./logs')

const templates = {
    commands: `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commandname')
        .setDescription('Command description'),
        
    async execute(interaction, client) {
        await interaction.reply({ content: 'Hello!', ephemeral: false });
    }
};`,

    buttons: `module.exports = {
    customId: 'buttonid',
    async execute(interaction, args, client) {
        await interaction.reply('Button clicked!');
    }
};`,

    menus: `module.exports = {
    customId: 'menuid',
    async execute(interaction, args, client) {
        const selected = interaction.values[0];
        await interaction.reply(\`Selected: \${selected}\`);
    }
};`,

    modals: `module.exports = {
    customId: 'modalid',
    async execute(interaction, args, client) {
        const input = interaction.fields.getTextInputValue('inputid');
        await interaction.reply(\`Received: \${input}\`);
    }
};`,

    prefix: `module.exports = {
    name: 'commandname',
    
    async execute(message, args, client) {
        await message.channel.send('Hello!');
        await message.delete();
    }
};`,

    events: `module.exports = {
    event: 'eventName',
    once: false,
    
    execute: function(client, ...args) {
        // Your event code here
    }
};`
};

function setupTemplateGenerator(client) {
    const componentsPath = path.join(__dirname, '../Components');
    const commandsPath = path.join(__dirname, '../Commands/Slash');
    const prefixPath = path.join(__dirname, '../Commands/Prefix');
    const eventsPath = path.join(__dirname, '../Events');

    const watchPaths = {
        commands: commandsPath,
        buttons: path.join(componentsPath, 'buttons'),
        menus: path.join(componentsPath, 'menus'),
        modals: path.join(componentsPath, 'modals'),
        prefix: prefixPath,
        events: eventsPath
    };

    for (const [type, dir] of Object.entries(watchPaths)) {
        fs.mkdirSync(dir, { recursive: true });
        
        fs.watch(dir, (eventType, filename) => {
            if (eventType === 'rename' && filename?.endsWith('.js')) {
                const filePath = path.join(dir, filename);
                
                if (!fs.existsSync(filePath)) return;
                
                const stats = fs.statSync(filePath);
                if (stats.size === 0) {
                    fs.writeFileSync(filePath, templates[type]);
                    console.log(`[ TEMPLATE ] Generated ${type} for ${filename}`);
                }
            }
        });
    }
}

module.exports = setupTemplateGenerator;