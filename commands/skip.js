const { Message } = require("discord.js");
const Keyv = require('keyv');
const DisTube = require('distube');

module.exports = {
    name: "skip",
    aliases: ['s'],
    description: "Skip command",
    /**
     * @param {Message} message
     * @param {String} args
     * @param {Keyv} keyv
     * @param {DisTube} distube
     */
    async execute(message, args, keyv, distube) {
        const voiceChannel = message.member.voice.channel;
        const voiceChannelId = await keyv.get(`playchannel.${message.guild.id}`);

        if (voiceChannel) {

            if (distube.isPlaying(message)) {

                if (voiceChannelId && voiceChannel.id === voiceChannelId) {
                    distube.skip(message);
                    message.channel.send('Song skipped.');
                } else message.channel.send('Please join the same voice channel i\'m in.');

            } else message.channel.send('I\'m currently not playing anything.');

        } else message.reply('Please connect to a voice channel.');
    },
};