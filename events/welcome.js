const { Events } = require('discord.js');

module.exports = {
    enabled: true,
    name: Events.GuildMemberAdd,
    once: false,
    
    execute(member) {
        
        console.log(`✅ Welcome: ${member.user.tag} (ID: ${member.id})`);
    }
};