const { Message } = require("discord.js");
const Keyv = require('keyv');
const DisTube = require('distube');

module.exports = {
    name: "play",
    aliases: ['p'],
    description: "Play command",
    /**
     * @param {Message} message
     * @param {String} args
     * @param {Keyv} keyv
     * @param {DisTube} distube
     */
    async execute(message, args, keyv, distube) {
        const voiceChannel = message.member.voice.channel;

        if (voiceChannel) {
            const permissions = voiceChannel.permissionsFor(message.client.user);

            if (permissions.has('CONNECT') && permissions.has('SPEAK')) {
                const connectedId = await keyv.get(`playchannel.${message.guild.id}`);

                if (distube.isPlaying(message) && connectedId && connectedId !== voiceChannel.id) {
                    message.channel.send('Please join the current voice channel to play the command.');
                    return;
                }

                if (!connectedId) {
                    try {
                        var connection = await voiceChannel.join();
                    } catch (error) {
                        await message.channel.send('Encountered an error while trying to connect to the voice channel.');
                        console.log(error.message);
                    }
                }

                await distube.play(message, args[0]);
                let queue = distube.getQueue(message);
                await message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
                    `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                ).join("\n"));
                await keyv.set(`playchannel.${message.guild.id}`, voiceChannel.id);

            } else message.reply('I don\'t have sufficient permissions.');

        } else message.reply('Please connect to a voice channel.');
    },
};