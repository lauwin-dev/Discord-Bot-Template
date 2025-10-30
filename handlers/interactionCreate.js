const { Events, WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ url: require('../config.json').webhook });

module.exports = (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command && interaction.commandName !== 'stats') return console.error(`No command matching ${interaction.commandName} was found.`);

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
            const button = [...client.buttons.entries()].find(([key]) => interaction.customId.startsWith(key));
            if (!button) return console.warn(`No button matching ${interaction.customId} was found.`);

            const [, buttonModule] = button;

            try {
                await buttonModule.execute(interaction, client);
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
