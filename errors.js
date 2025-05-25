const { WebhookClient } = require('discord.js');

module.exports = (client, config) => {
    const webhook = new WebhookClient({ url: config.webhook });

    process.on('unhandledRejection', (reason, promise) => {
        if (String(reason).includes('Unknown Message') || String(reason).includes('Unknown interaction')) return;
        console.error('Unhandled Rejection:', reason);
        webhook.send({
            content: `${client.user.tag} || ${client.user.id} Error:\n\`\`\`${reason.stack || reason}\`\`\``,
        }).catch(console.error);
    });


    process.on('uncaughtException', (error) => {
        const errorMessage = String(error);
        if (errorMessage.includes('Unknown Message') || errorMessage.includes('Unknown interaction')) return;
        console.error('Uncaught Exception:', error);
        webhook.send({
            content: `${client.user.tag} || ${client.user.id} Error:\n\`\`\`${error.stack || error}\`\`\``,
        }).catch(console.error);
    });

    client.on('error', (error) => {
        const errorMessage = String(error);
        if (errorMessage.includes('Unknown Message') || errorMessage.includes('Unknown interaction')) return;
        console.error('Client Error:', error);
        webhook.send({
            content: `${client.user.tag} || ${client.user.id} Error:\n\`\`\`${error.stack || error}\`\`\``,
        }).catch(console.error);
    });
};