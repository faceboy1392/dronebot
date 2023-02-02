import { ChatInput, CommandData, CommandType, Executable } from "../classes/Command";
import Bot from "../classes/Bot";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

// Static data about the command
const data: CommandData = {
  structure: {
    name: "help",
    description: "About me",
    type: CommandType.ChatInput,
  },
  scope: "global",
  perms: {
    bot: [],
  },
};

// New instance of implementation made each time the command is used
class Impl extends Executable {
  async execute(bot: Bot, interaction: ChatInput) {
    const embed = new EmbedBuilder()
      .setTitle("About me (/help)")
      .setColor(0xe0963c)
      .setDescription(
        "Hi, I'm a bot designed by <@718930767740403753> to analyze the `.drn` files used by the game *Nimbatus* to store player-made drones." +
          "\nI can read data about a drone's name, description, part/weapon count, size, and provide an image of the drone, and all you need to do is post a `.drn` file and I'll automatically analyze it." +
          '\nYou can also use a message context menu command on a message containing an attached `.drn` file. Click the three dots next to a message, and under "Apps" click "Preview drone"' +
          "\n\nI'm completely free to use and open source, with no form of configuration needed at all. If you don't want me to analyze `.drn` files in a specific channel, just remove my \"Send Messages\" permission in that channel." +
          "\n\n*My developer also has another work-in-progress bot, Bob Bot, designed to provide a combination of fun and useful commands to help you run a server or just access unlimited cat images.*"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=1060614689173807225&permissions=34816&scope=bot%20applications.commands"
        ),
      new ButtonBuilder()
        .setLabel("GitHub")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/faceboy1392/dronebot"),
      new ButtonBuilder().setLabel("Bob Bot").setStyle(ButtonStyle.Link).setURL("https://discord.gg/33Aw6gWmmV")
    );

    interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
}

// don't touch this
export default { data, name: data.structure.name, Impl };
