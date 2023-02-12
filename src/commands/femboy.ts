import { ChatInput, CommandData, CommandType, Executable } from "../classes/Command";
import Bot from "../classes/Bot";
import ms from "ms";

// Static data about the command
const data: CommandData = {
  structure: {
    name: "femboy",
    description: "for robo",
    type: CommandType.ChatInput,
  },
  scope: "guild",
  guildId: "384749838928969728",
  perms: {
    bot: [],
  },
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: ChatInput) {
    interaction.reply("fembozo");
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };
