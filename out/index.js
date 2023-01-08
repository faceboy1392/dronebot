"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const discord_js_1 = require("discord.js");
const unzip_stream_1 = __importDefault(require("unzip-stream"));
const node_stream_1 = require("node:stream");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_events_1 = require("node:events");
const path_1 = require("path");
const xml2js_1 = __importDefault(require("xml2js"));
const parser = new xml2js_1.default.Parser();
const client = new discord_js_1.Client({
    partials: [discord_js_1.Partials.User, discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember],
    intents: [discord_js_1.IntentsBitField.Flags.Guilds, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.MessageContent],
    allowedMentions: { repliedUser: false, parse: ["everyone", "roles", "users"] },
});
client.login(process.env.TOKEN);
client.once("ready", () => {
    console.log(`Ready as ${client.user.tag}`);
    client.user.setActivity({ name: "Nimbatus", type: discord_js_1.ActivityType.Playing });
});
client.on("messageCreate", async (message) => {
    if (message.channel.type === discord_js_1.ChannelType.DM)
        return message.reply("im busy go away");
    if (!message.channel.permissionsFor(message.guild.members.me).has(discord_js_1.PermissionFlagsBits.SendMessages))
        return;
    if (message.guild.members.me.isCommunicationDisabled())
        return;
    try {
        if (message.author.bot)
            return;
        if (!message.attachments.size)
            return;
        const drn = message.attachments.first();
        if (!drn.name.trim().toLowerCase().endsWith(".drn"))
            return;
        const response = await fetch(drn.url);
        // @ts-ignore
        const droneZip = node_stream_1.Readable.fromWeb(response.body);
        const imageStream = (0, node_fs_1.createWriteStream)("Image.png"), droneStream = (0, node_fs_1.createWriteStream)("DroneData");
        droneZip.pipe(unzip_stream_1.default.Parse()).on("entry", (entry) => {
            if (entry.type !== "File")
                return;
            switch (entry.path) {
                case "Image.png":
                    entry.pipe(imageStream);
                    break;
                case "DroneData":
                    entry.pipe(droneStream);
                    break;
                default:
                    entry.autodrain();
            }
        });
        await Promise.all([(0, node_events_1.once)(imageStream, "close"), (0, node_events_1.once)(droneStream, "close"), (0, node_events_1.once)(droneZip, "end")]);
        const data = (await (0, promises_1.readFile)((0, path_1.join)(__dirname, "../DroneData"), "utf-8")).toString();
        const json = (await parser.parseStringPromise(data)).DroneData;
        const name = json.DroneName?.[0] ?? "Unnamed drone", description = json.Description?.[0], parts = json.NumberOfParts?.[0] ?? "0", weapons = json.NumberOfweapons?.[0] ?? "0", diameter = parseFloat(json.Diameter?.[0] ?? "0"), version = json.Version?.[0] ?? "huh", lastEdit = json.LastEditTime?.[0] ? new Date(json?.LastEditTime?.[0]) : null;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(name)
            .setColor(0xe0963c)
            .setAuthor({
            name: "made by " + message.member.displayName,
            iconURL: message.member.displayAvatarURL(),
        })
            .setDescription((description ? `"${description}"\n` : "") +
            `\`${parts}\` parts, \`${weapons}\` weapons, diameter of \`${diameter.toFixed(2)}\``)
            .setImage("attachment://Image.png")
            .setFooter({ text: `v${version}, last edited:` })
            .setTimestamp(lastEdit);
        const attachment = new discord_js_1.AttachmentBuilder((0, path_1.join)(__dirname, "../Image.png"), { name: "Image.png" });
        message.reply({ embeds: [embed], files: [attachment] });
    }
    catch (e) {
        console.error(e);
        message.reply("error, couldn't preview drone, sorry").catch(() => { });
    }
});
//# sourceMappingURL=index.js.map