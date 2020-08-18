const { Message } = require("discord.js");
const Keyv = require("keyv");

module.exports = {
    name: 'setprefix',
    aliases: ['sp'],
    description: 'Set a new prefix for the bot.',
    /**
     * @param {Message} message 
     * @param {String} args 
     * @param {Keyv} keyv
     */
    async execute(message, args, keyv) {
        if (message.member.hasPermission("ADMINISTRATOR") && args.length == 1 && args[0].length <= 5) {
            await message.delete();
            await keyv.set(`prefix.${message.guild.id}`, args[0]);
            message.channel.startTyping();
            var sent = await message.channel.send(`✅ Prefix successfully set to \`${args[0]}\``);
            message.channel.stopTyping(true);
            sent.delete({ timeout: 15000 });
        }
    },
};