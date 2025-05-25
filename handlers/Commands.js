const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes, Collection } = require('discord.js');
const { clientId, guildId, token } = require(path.resolve(__dirname, '../config.json'));

/**
 * @param {string} dir 
 * @returns {string[]} 
 */
function getCommandFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir, { withFileTypes: true });
    return files.flatMap((file) => {
        const fullPath = path.join(dir, file.name);
        return file.isDirectory() ? getCommandFiles(fullPath) : fullPath.endsWith('.js') ? fullPath : [];
    });
}

/**
 * @param {object} client 
 */
module.exports = async (client) => {
    client.commands = new Collection();

    const commandFiles = getCommandFiles(path.resolve(__dirname, '../commands'));
    if (commandFiles.length === 0) {
        console.log('No commands found to load.');
        return;
    }

    console.log(`📄 Command files found: ${commandFiles.length}`);

    const commands = [];
    const disabledCommands = [];
    for (const file of commandFiles) {
        try {
            const command = require(file);
            if (command.enabled) {
                if (command.data) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                }
            } else {
                disabledCommands.push(command.name || command.data.name);
            }
        } catch (error) {
            console.error(`❌ Failed to load command file ${file}:`, error);
        }
    }

    if (commands.length === 0) {
        console.log('No enabled commands to register.');
        return;
    }

    console.log(`✅ Loaded ${commands.length} commands.`);
    if (disabledCommands.length > 0) {
        console.log(`⚠️ Disabled commands: ${disabledCommands.join(', ')}`);
    }

    const rest = new REST({ version: '10' }).setToken(token);

    console.log('------------------------------------')
    console.log(`🔧 Client ID: ${clientId}`);
    console.log(`🔧 Guild ID: ${guildId || 'Global (No Guild)'}`);
    console.log('------------------------------------')

    try {
        if (guildId) {
            console.log('Registering guild commands...');
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        } else {
            console.log('Registering global commands...');
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
        }
        console.log('✅ Successfully registered all application commands.');
    } catch (error) {
        console.error('❌ Error registering application commands:', error);
    }
};
