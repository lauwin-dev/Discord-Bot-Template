const fs = require('fs');
const path = require('path');

function Filesystem(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let eventFiles = [];

    for (const file of files) {
        if (file.isDirectory()) {
            eventFiles = [...eventFiles, ...Filesystem(`${dir}/${file.name}`)];
        } else if (file.name.endsWith('.js')) {
            eventFiles.push(`${dir}/${file.name}`);
        }
    }

    return eventFiles;
}

module.exports = (client) => {
    const eventFiles = Filesystem(path.resolve(__dirname, '../events'));
    const loadedEvents = [];
    const disabledEvents = [];

    for (const file of eventFiles) {
        const event = require(file);

        if (event.enabled) {
            if (event.once) {
                client.once(event.name, (...args) => {
                    event.execute(...args, client);
                });
            } else {
                client.on(event.name, (...args) => {
                    event.execute(...args, client);
                });
            }
            loadedEvents.push(event.name);
        } else {
            disabledEvents.push(event.name);
        }
    }

    console.log(`✅ Loaded events: ${loadedEvents.join(', ') || 'None'}`);
    console.log(`⚠️ Disabled events: ${disabledEvents.join(', ') || 'None'}`);
    console.log('------------------------------------');
};
