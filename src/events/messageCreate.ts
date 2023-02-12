import { EventData, EventExecutable } from "../classes/Event";
import Bot from "../classes/Bot";

import { AttachmentBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, Message } from "discord.js";

import unzip from "unzip-stream";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { join } from "path";
import xml2js from "xml2js";

const parser = new xml2js.Parser();

const data: EventData = {
  name: "messageCreate",
  once: false,
};

class Impl extends EventExecutable {
  async execute(bot: Bot, message: Message) {
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

      const unzipParser = unzip.Parse();
      unzipParser.once("error", (err) => {
        droneZip.destroy(new Error("bruh emoji"));
        imageStream.destroy();
        droneStream.destroy();
      });

      droneZip.pipe(unzipParser).on("entry", (entry) => {
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

      const data = (await readFile("DroneData", "utf-8")).toString();
      const json = (await parser.parseStringPromise(data)).DroneData;

      const name = json.DroneName?.[0] ?? "Unnamed drone",
        description = json.Description?.[0],
        parts = json.NumberOfParts?.[0] ?? "0",
        weapons = json.NumberOfWeapons?.[0] ?? "0",
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
      const attachment = new AttachmentBuilder("Image.png", { name: "Image.png" });

      await message.reply({ embeds: [embed], files: [attachment] });
    } catch (err) {
      console.error(err)
      message.reply("nah bruh are you sure that's a real `.drn` file 💀").catch(() => {});
    }
  }
}

export default { name: data.name, once: data.once, Impl };
