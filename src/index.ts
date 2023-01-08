import * as dotenv from "dotenv";
dotenv.config();

import {
  ActivityType,
  AttachmentBuilder,
  ChannelType,
  Client,
  EmbedBuilder,
  IntentsBitField as I,
  Partials,
  PermissionFlagsBits,
} from "discord.js";

import unzip from "unzip-stream";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { join } from "path";
import xml2js from "xml2js";

const parser = new xml2js.Parser();

const client = new Client({
  partials: [Partials.User, Partials.Channel, Partials.Message, Partials.Reaction, Partials.GuildMember],
  intents: [I.Flags.Guilds, I.Flags.GuildMessages, I.Flags.MessageContent],
  allowedMentions: { repliedUser: false, parse: ["everyone", "roles", "users"] },
});

client.login(process.env.TOKEN);

client.once("ready", () => {
  console.log(`Ready as ${client.user.tag}`);
  client.user.setActivity({ name: "Nimbatus", type: ActivityType.Playing });
});

client.on("messageCreate", async (message): Promise<any> => {
  if (message.channel.type === ChannelType.DM) return message.reply("im busy go away");

  if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.SendMessages)) return;
  if (message.guild.members.me.isCommunicationDisabled()) return;

  try {
    if (message.author.bot) return;
    if (!message.attachments.size) return;

    const drn = message.attachments.first();
    if (!drn.name.trim().toLowerCase().endsWith(".drn")) return;

    const response = await fetch(drn.url);

    // @ts-ignore
    const droneZip = Readable.fromWeb(response.body);
    const imageStream = createWriteStream("Image.png"),
      droneStream = createWriteStream("DroneData");

    droneZip.pipe(unzip.Parse()).on("entry", (entry) => {
      if (entry.type !== "File") return;

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

    await Promise.all([once(imageStream, "close"), once(droneStream, "close"), once(droneZip, "end")]);

    const data = (await readFile(join(__dirname, "../DroneData"), "utf-8")).toString();
    const json = (await parser.parseStringPromise(data)).DroneData;

    const name = json.DroneName?.[0] ?? "Unnamed drone",
      description = json.Description?.[0],
      parts = json.NumberOfParts?.[0] ?? "0",
      weapons = json.NumberOfweapons?.[0] ?? "0",
      diameter = parseFloat(json.Diameter?.[0] ?? "0"),
      version = json.Version?.[0] ?? "huh",
      lastEdit = json.LastEditTime?.[0] ? new Date(json?.LastEditTime?.[0]) : null;

    const embed = new EmbedBuilder()
      .setTitle(name)
      .setColor(0xe0963c)
      .setAuthor({
        name: "made by " + message.member.displayName,
        iconURL: message.member.displayAvatarURL(),
      })
      .setDescription(
        (description ? `"${description}"\n` : "") +
          `\`${parts}\` parts, \`${weapons}\` weapons, diameter of \`${diameter.toFixed(2)}\``
      )
      .setImage("attachment://Image.png")
      .setFooter({ text: `v${version}, last edited:` })
      .setTimestamp(lastEdit);
    const attachment = new AttachmentBuilder(join(__dirname, "../Image.png"), { name: "Image.png" });

    message.reply({ embeds: [embed], files: [attachment] });
  } catch (e) {
    console.error(e);
    message.reply("error, couldn't preview drone, sorry").catch(() => {});
  }
});
