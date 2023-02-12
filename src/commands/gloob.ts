import { ChatInput, CommandData, CommandType, Executable, OptionType } from "../classes/Command";
import Bot from "../classes/Bot";

// Static data about the command
const data: CommandData = {
  structure: {
    name: "gloob",
    description: "_",
    type: CommandType.ChatInput,
    options: [
      {
        name: "glaba",
        description: "tokloyak",
        type: OptionType.String,
      },
    ],
  },
  scope: "global",
  perms: {
    bot: [],
  },
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: ChatInput) {
    if (interaction.user.id !== "718930767740403753") return interaction.reply("you arent gindley enough");
    interaction.guild.members.me
      .setNickname(interaction.options.getString("glaba"))
      .then(() => interaction.reply({ content: "ok", ephemeral: true }))
      .catch(() => interaction.reply({ content: "fail", ephemeral: true }));
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };
