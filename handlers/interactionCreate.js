const { WebhookClient } = require('discord.js');
const config = require('../config.json');
const webhook = new WebhookClient({ url: config.webhook });

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}`, error);
                const replyMethod = interaction.replied || interaction.deferred ? 'followUp' : 'reply';
                await interaction[replyMethod]({ content: 'There was an error while executing this command!', ephemeral: true });
                await webhook.send({
                    content: `${client.user.tag} || ${client.user.id} Error executing command ${interaction.commandName}:\n\`\`\`${error}\`\`\``,
                }).catch(console.error);
            }
        }

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return console.warn(`No button matching ${interaction.customId} was found.`);

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing button ${interaction.customId}`, error);
                const replyMethod = interaction.replied || interaction.deferred ? 'followUp' : 'reply';
                await interaction[replyMethod]({ content: 'There was an error while executing this button!', ephemeral: true });
                await webhook.send({
                    content: `${client.user.tag} || ${client.user.id} Error executing button ${interaction.customId}:\n\`\`\`${error}\`\`\``,
                }).catch(console.error);
            }
        }
    });
};
