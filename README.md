
# Discord Bot Template
A modular **Discord.js v14** bot template, ready for building your own Discord bot efficiently.

---

## 🌟 Features
This template provides:

- **Slash Command Handler** – Easily add commands in the `commands/` folder.
- **Event Handler** – Modular event system (`welcome.js`, etc.).
- **Button Interaction Handler** – Centralized handling of button clicks.
- **Embed Responses** – Commands can send rich embeds.
- **Enable/Disable Commands/Events** – Toggle any module with `enabled: true/false`.

---

## 🗂 Project Structure


.
├─ buttons/                 # Button modules (example: ping.js)
├─ commands/                # Slash commands (example: ping.js)
├─ events/                  # Event modules (example: welcome.js)
├─ handlers/
│   ├─ Commands.js          # Loads command modules
│   ├─ Events.js            # Loads event modules
│   ├─ interactionCreate.js # Handles interactions & button clicks
│   └─ loadButtons.js       # Loads button modules
├─ config.json              # Bot token, clientId, guildId
├─ errors.js                # Error handling module
├─ index.js                 # Main bot entry point
├─ package.json             # Project dependencies
└─ package-lock.json

````

### Explanation
- `commands/` – Each command is a module exporting `data`, `execute()`, and `enabled`.
- `events/` – Place Discord event listeners here.
- `buttons/` – Store all button interactions here. Example: a button for `/ping`.
- `handlers/` – Centralized loaders and handlers for commands, events, and buttons.

---

## 🚀 Getting Started

### 1. Clone the Template
```bash
git clone https://github.com/lauwin-dev/Discord-Bot-Template.git
cd Discord-Bot-Template
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Bot

```bash
cp config.json.example config.json
```

Edit `config.json`:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID"
}
```

### 4. Run the Bot

```bash
node index.js
```

---

## ⚡ Example Command: `/ping`

```js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    enabled: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        const ping = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Latency: **${ping}ms**`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setFooter({ text: 'LW Shop', iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ping')
                    .setLabel('Ping')
                    .setEmoji('🏓')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [button] });
    }
};
```

> Buttons are automatically loaded via `handlers/loadButtons.js`.

---

## 🎯 Why Use This Template?

* **Ready-to-use** – start building your bot immediately.
* **Modular** – easily add commands, events, and buttons without touching core code.
* **Scalable** – suitable for both small and larger bots.
* **Clean & Organized** – centralized handlers for maintainability.

---

## ❓ Support

For help or questions, join our Discord server, or dm me:
[Discord Support Server](https://discord.gg/JKqKZjbq)
[Me Discord Profile](https://discord.com/users/789168526065008640)

