import { CommandData, CommandType, Executable, MessageContext } from "../classes/Command";
import Bot from "../classes/Bot";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import unzip from "unzip-stream";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { join } from "path";
import xml2js from "xml2js";

const parser = new xml2js.Parser();

// Static data about the command
const data: CommandData = {
  structure: {
    name: "Preview drone",
    type: CommandType.Message,
  },
  scope: "global",
  perms: {
    bot: [],
  }
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: MessageContext) {
    await interaction.deferReply();

    const message = await interaction.channel.messages.fetch(interaction.targetId);
    if (!message) return interaction.followUp({ content: "uhh error, idk why", ephemeral: true });

    try {
      if (!message.attachments.size)
        return interaction.followUp({ content: "That message has no attachments!", ephemeral: true });

      const drn = message.attachments.first();
      if (!drn.name.trim().toLowerCase().endsWith(".drn"))
        return interaction.followUp({ content: "That message has no `.drn` files!", ephemeral: true });

        const member = await message.guild.members.fetch(message.author);

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
          name: "made by " + member.user.displayName,
          iconURL: member?.displayAvatarURL() || undefined,
        })
        .setDescription(
          (description ? `"${description}"\n` : "") +
            `\`${parts}\` parts, \`${weapons}\` weapons, diameter of \`${diameter.toFixed(2)}\``
        )
        .setImage("attachment://Image.png")
        .setFooter({ text: `v${version}, last edited:` })
        .setTimestamp(lastEdit);
      const attachment = new AttachmentBuilder("Image.png", { name: "Image.png" });

      const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Remove")
        .setCustomId(`del_${member.id}`)
        .setStyle(ButtonStyle.Danger)
      )

      const canSendMessages = interaction.channel.permissionsFor(interaction.user).has("SendMessages")

      await interaction.followUp({ embeds: [embed], files: [attachment], components: canSendMessages ? [row] : undefined, ephemeral: !canSendMessages });
    } catch (err) {
      console.error(err)
      interaction
        .followUp({ content: "nah bruh are you sure that's a real `.drn` file 💀", ephemeral: true })
        .catch((e) => { console.error(e) });
    }
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };