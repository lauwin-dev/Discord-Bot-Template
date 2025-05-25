const { MessageFlags } = require('discord.js');

module.exports = {
    customId: 'ping',
    
    async execute(interaction, client) {

        await interaction.reply({ content: 'Pong 🏓', flags: MessageFlags.Ephemeral });
    }
};
