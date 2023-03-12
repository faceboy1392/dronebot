import { ChatInput, CommandData, CommandType, Executable, OptionType } from "../classes/Command";
import Bot from "../classes/Bot";
import { Channel, EmbedBuilder, GuildMember, NonThreadGuildBasedChannel, Role } from "discord.js";

// Static data about the command
const data: CommandData = {
  structure: {
    name: "perms",
    description: "View a user's permissions in a server.",
    type: CommandType.ChatInput,
    options: [
      {
        name: "target",
        description: "The user/role to view the permissions of.",
        type: OptionType.Mentionable,
        required: true,
      },
    ],
    dmPermission: false
  },
  scope: "guild",
  guildId: "369851421719527425",
  perms: {
    bot: [],
  },
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: ChatInput) {
    let channel: Channel = interaction.channel;
    if (channel.isThread()) channel = channel.parent;
    let target = interaction.options.getMentionable("target") as GuildMember | Role;

    const serverPerms = Object.entries(target.permissions.serialize());
    const channelPerms = Object.entries(target.permissionsIn(channel as NonThreadGuildBasedChannel).serialize());

    const description = `
Target: ${target}
Channel: ${channel}
Permission bitfield: \`${target.permissions.bitfield}\`
    `;

    const permCount = serverPerms.length;
    let formattedPerms: string[] = ["", ""];
    for (let i = 0; i < permCount; i++) {
      const output = `${serverPerms[i][1] ? "✅" : "❌"} | ${
        channelPerms[i][1] ? "✅" : "❌"
      } - ${this.formatPermission(serverPerms[i][0])}\n`;
      if (i % permCount < permCount / 2) {
        formattedPerms[0] += output;
      } else {
        formattedPerms[1] += output;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("Permissions")
      .setColor("White")
      .setDescription(description)
      .addFields(
        {
          name: "⠀",
          value: `📢 | 💬 - Server/Channel\n————————————————\n${formattedPerms[0]}`,
          inline: true,
        },
        {
          name: "⠀",
          value: `📢 | 💬 - Server/Channel\n————————————————\n${formattedPerms[1]}`,
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  formatPermission(name: string): string {
    return name.replace(/([A-Z]+)/g, " $1")
      .replace(/([A-Z][a-z])/g, " $1")
      .replace("Guild", "Server")
      .split(/ +/).join(" ").trim();
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };
