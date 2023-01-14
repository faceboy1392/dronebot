import { ChatInput, CommandData, CommandType, Executable } from "../classes/Command";
import Bot from "../classes/Bot";
import ms from "ms";

// Static data about the command
const data: CommandData = {
  structure: {
    name: "ping",
    description: "Useful to test if I'm online.",
    type: CommandType.ChatInput,
  },
  scope: "global",
  perms: {
    bot: [],
  }
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: ChatInput) {
    return interaction.reply(
      `\`(${interaction.client.ws.ping}ms latency, online for ${ms(bot.client.uptime)})\`\n*Pong!*`
    );
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };
