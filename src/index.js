const mineflayer = require('mineflayer');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

// Mineflayer "Modules"
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

function createBot(Username, Password) {
    const bot = mineflayer.createBot({
        host: config.Server.host,
        port: config.Server.port,
        username: Username,
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        if (message.includes('AuthMeReloaded') || message.includes('AuthMeReloaded Protection')) {
            console.log('AuthMeReloaded detected!');
        }

        if (message.startsWith(prefix)) {
            const args = message.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
            if (fs.existsSync(commandPath)) {
                try {
                    const command = require(commandPath);

                    if (typeof command.execute === 'function') {
                        command.execute(bot, username, args);
                    } else {
                        bot.chat(`Command "${commandName}" is not properly configured.`);
                    }
                } catch (err) {
                    console.error(`Error executing command "${commandName}":`, err);
                }
            } else {
                bot.chat(`Unknown command: ${commandName}`);
            }
        }
    });

    bot.once('login', () => {
        console.log(`Logged in as ${bot.username}`);
    });

    bot.once('spawn', () => {
        console.log(`Bot spawned in the server`);
    });

    bot.once('error', (err) => {
        console.log('Error:', err);
    });

    bot.once('kicked', (reason) => {
        console.log('Kicked:', reason);
    });

    bot.once('end', () => {
        console.log('Disconnected from server.');
    });
}