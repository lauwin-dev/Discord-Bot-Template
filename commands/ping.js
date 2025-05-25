const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    enabled: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    
    async execute(interaction) {
        const ping = interaction.client.ws.ping; // Get bot's ping
        
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Latency: **${ping}ms**`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setFooter({ text: 'LW Shop', iconURL: interaction.guild.iconURL({ dynamic: true}) })
            .setTimestamp();

        const button = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('ping').setLabel('Ping').setEmoji('🏓').setStyle(ButtonStyle.Secondary));

        await interaction.reply({ embeds: [embed], components: [button] });
    }
};
