const { Client, GatewayIntentBits, Events, ActivityType, WebhookClient } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const interactionCreate = require('./handlers/interactionCreate');
const CommandLoader = require('./handlers/Commands');
const EventsLoader = require('./handlers/Events');
const loadButtons = require('./handlers/loadButtons');
const errors = require('./errors');

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let currentActivity = 0;
interactionCreate(client);
CommandLoader(client);
EventsLoader(client);
loadButtons(client);
errors(client, config);

// Set Bot Status
client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Activity Rotator
    const activities = [
        { name: 'discord.gg/LWShop', type: ActivityType.Custom },
        { name: '', type: ActivityType.Watching }, // Number of members
    ];

    setInterval(() => {
        if (currentActivity === 1) {
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            activities[1].name = `${totalMembers} Members`;
        }

        const activity = activities[currentActivity];
        client.user.setActivity(activity.name, { type: activity.type });
        currentActivity = (currentActivity + 1) % activities.length;
    }, 10000); // Every 10 seconds
});

// Log in to Discord
client.login(config.token);
