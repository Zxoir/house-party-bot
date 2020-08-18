const { Message } = require("discord.js");
const Keyv = require("keyv");

module.exports = {
    name: 'setrole',
    aliases: ['sr'],
    description: 'Set an automatic role for when a user joins a guild.',
    /**
     * @param {Message} message 
     * @param {String} args 
     * @param {Keyv} keyv
     */
    async execute(message, args, keyv) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (args.length == 1 && (args[0].toLowerCase() == 'none' || message.mentions.roles.first().id)) {
                await message.delete();
                args[0].toLowerCase() == 'none' ? await keyv.delete(`autorole.${message.guild.id}`) : await keyv.set(`autorole.${message.guild.id}`, message.mentions.roles.first().id);
                message.channel.startTyping();
                var sent = await message.channel.send(args[0].toLowerCase() == 'none' ? `✅ Auto role has been reset.` : `✅ Auto role set to ${message.mentions.roles.first()}`);
                message.channel.stopTyping(true);
                sent.delete({ timeout: 15000 });
            }
        }
    },
};