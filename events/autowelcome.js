const { GuildMember } = require("discord.js");
const Keyv = require("keyv");

module.exports = {
    /**
     * @param {GuildMember} member
     * @param {Keyv} keyv
     */
    async execute(member, keyv) {
        const channelId = await keyv.get(`autowelcome.${member.guild.id}`);
        if (channelId) {
            const channel = await member.guild.channels.cache.get(channelId);
            if (channel !== null) {
                channel.startTyping();
                await channel.send(`Welcome, ${member}`);
                channel.stopTyping(true);
            }
        }
    },
};