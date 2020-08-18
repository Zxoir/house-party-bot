const { Message } = require("discord.js");
const Keyv = require("keyv");

module.exports = {
    name: 'setwelcome',
    aliases: ['sw'],
    description: 'Set the channel where the autowelcome message is sent.',
    /**
     * @param {Message} message 
     * @param {String} args 
     * @param {Keyv} keyv
     */
    async execute(message, args, keyv) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (args.length == 1 && (args[0].toLowerCase() == 'none' || message.mentions.channels.first().id)) {
                await message.delete();
                args[0].toLowerCase() == 'none' ? await keyv.delete(`autowelcome.${message.guild.id}`) : await keyv.set(`autowelcome.${message.guild.id}`, message.mentions.channels.first().id);
                message.channel.startTyping();
                var sent = await message.channel.send(args[0].toLowerCase() == 'none' ? `✅ Auto welcome channel has been reset.` : `✅ Auto welcome channel set to ${args[0]}`);
                message.channel.stopTyping(true);
                sent.delete({ timeout: 15000 });
            }
        }
    },
};