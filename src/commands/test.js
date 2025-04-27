module.exports = {
    description: "Sends a greeting to the user.",
    type: "fun",
    execute: (bot, username, args) => {
        bot.chat(`Hello, ${username}!`);
    },
};