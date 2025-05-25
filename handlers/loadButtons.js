const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.buttons = new Map();
    const buttonsPath = path.join(__dirname, '../buttons'); // שינוי הנתיב לתיקייה הראשית

    if (!fs.existsSync(buttonsPath)) {
        console.warn(`[WARNING] Buttons directory not found: ${buttonsPath}`);
        return;
    }

    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

    for (const file of buttonFiles) {
        const button = require(`../buttons/${file}`);
        if (button.customId && typeof button.execute === 'function') {
            client.buttons.set(button.customId, button);
        } else {
            console.warn(`[WARNING] The button file ${file} is missing a valid customId or execute function.`);
        }
    }

    console.log(`✅ Loaded ${client.buttons.size} buttons.`);
};
