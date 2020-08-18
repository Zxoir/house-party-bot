const { GuildMember } = require("discord.js");
const Keyv = require("keyv");

module.exports = {
    /**
     * @param {GuildMember} member 
     * @param {Keyv} keyv
     */
    async execute(member, keyv) {
        const roleId = await keyv.get(`autorole.${member.guild.id}`);
        if (roleId) {
            const role = await member.guild.roles.fetch(roleId);
            if (role !== null)
                member.roles.add(role);
        }
    },
};