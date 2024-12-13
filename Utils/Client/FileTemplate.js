const fs = require('fs');
const path = require('path');
const console = require('../logs')

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
        await message.reply('Hello!');
    }
};`,

    events: `module.exports = {
    event: 'eventName',
    once: false,
    
    async execute(client, ...args) {
        // Your event code here
    }
};`,
    context: `const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
    
    module.exports = {
        data: new ContextMenuCommandBuilder()
            .setName('Command Name')
            .setType(/*the application type you want*/), // ApplicationCommandType.User, ApplicationCommandType.Message
        async execute(interaction, client) {
            //code goes here
        },
    };
    `
};

function setupTemplateGenerator(client) {
    const componentsPath = path.join(__dirname, '../../Components');
    const commandsPath = path.join(__dirname, '../../Commands/Slash');
    const prefixPath = path.join(__dirname, '../../Commands/Prefix');
    const eventsPath = path.join(__dirname, '../../Events');
    const contextPath = path.join(__dirname, '../../Commands/Context');

    const watchPaths = {
        commands: commandsPath,
        buttons: path.join(componentsPath, 'buttons'),
        menus: path.join(componentsPath, 'menus'),
        modals: path.join(componentsPath, 'modals'),
        prefix: prefixPath,
        events: eventsPath,
        context: contextPath
    };

    for (const [type, dir] of Object.entries(watchPaths)) {
        fs.mkdirSync(dir, { recursive: true });
        
        fs.watch(dir, (eventType, filename) => {
            if (eventType === 'rename' && filename?.endsWith('.js')) {
                const filePath = path.join(dir, filename);
                
                if (!fs.existsSync(filePath)) return;
                const fileNameWithoutExt = path.basename(filename, '.js');
                templates[type] = templates[type].replace(/(setName\(|name: |customId: |event: )'[^']*'/ , `$1'${fileNameWithoutExt}'`);
                const stats = fs.statSync(filePath);
                if (stats.size === 0) {
                    fs.writeFileSync(filePath, templates[type]);
                    console.info(`Generated ${type} for ${filename}`);
                }
            }
        });
    }
}

module.exports = setupTemplateGenerator;