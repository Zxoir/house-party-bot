const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const winston = require("winston");
const Keyv = require('keyv');
const keyv = new Keyv('mysql://root:@localhost:3306/test');
const autorole = require('./events/autorole');
const autowelcome = require('./events/autowelcome');
const DisTube = require('distube');
const distube = new DisTube(client);
const ytpl = require('ytpl');

ytpl.do_warn_deprecate = false;

keyv.on('error', err => logger.log('error', 'Keyv connection error:', err));

const logger = winston.createLogger({
    transports: new winston.transports.Console(),
    format: winston.format.printf(
        (log) => `[${log.level.toUpperCase()}] - ${log.message}`
    ),
});

async function loadCommands() {
    try {
        client.commands = new Discord.Collection();
        client.aliases = new Discord.Collection();
        let commandFiles;

        fs.readdir('./commands', async function(err, files) {
            if (err) logger.log('error', err.message)
            else {
                commandFiles = files.filter(file => file.endsWith(".js"));

                for (let file of commandFiles) {
                    let command = require(`./commands/${file}`);
                    await client.commands.set(command.name, command);
                    for (let alias of command.aliases) {
                        await client.aliases.set(alias, command);
                    }
                }
            }
        });

        logger.log('info', 'Commands loaded');

    } catch (error) { logger.log('error', error.message); }
}
loadCommands();

client.once('ready', () => {
    logger.log('info', `I'm online.`);
});

client.on('message', async message => {
    if (message.author.bot || !message.guild) return;

    const temp = await keyv.get(`prefix.${message.guild.id}`);
    const prefix = temp === undefined ? '!' : await keyv.get(`prefix.${message.guild.id}`);
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix)) return;
    if (!client.commands.has(command) && !client.aliases.has(command)) return;

    try {
        if (!client.aliases.has(command)) client.commands.get(command).execute(message, args, keyv, distube);
        else client.aliases.get(command).execute(message, args, keyv, distube);
    } catch (err) {
        logger.log('error', err.message);
        message.reply('There was an issue executing the command.');
    }
});

client.on("guildMemberAdd", async member => {
    autorole.execute(member, keyv);
    autowelcome.execute(member, keyv);
});

client.login(process.env.token);