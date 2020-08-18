const { Message } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: [''],
    description: "Ping command",
    /**
     * @param {Message} message
     * @param {String} args
     */
    async execute(message) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            await message.delete();
            message.channel.startTyping();
            await message.channel.send(`Current ping is ${message.client.ws.ping}ms.`);
            message.channel.stopTyping(true);
        }
    },
};