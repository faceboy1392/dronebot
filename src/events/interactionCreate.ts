import { EventData, EventExecutable } from "../classes/Event";
import Bot from "../classes/Bot";
import { CommandInteraction } from "discord.js";

const data: EventData = {
  name: "interactionCreate",
  once: false,
};

class Impl extends EventExecutable {
  async execute(bot: Bot, interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({ content: "sorry, that command is somehow missing from my code...", ephemeral: true });
    if (command.data.disable)
      return interaction.reply({ content: "Sorry, that command is disabled by my developer.", ephemeral: true });

    if (!interaction.channel.isDMBased() && !interaction.appPermissions.has(command.data.perms.bot)) {
      const missing = interaction.guild.members.me
        .permissionsIn(interaction.channel)
        .missing(command.data.perms.bot)
        .join(", ");

      return interaction.reply({
        content: `Sorry, I'm missing the permissions for that command. I need a role with the following permissions: \`${missing}\``,
      });
    }

    new command.Impl().execute(bot, interaction).catch((err) => {
      console.error(err);
      interaction
        .reply({
          content:
            "Sorry, I got an unknown error trying to run that command for you. If this continues, try contacting my developer (`@faceboy#1392`).",
        })
        .catch();
    });
  }
}

export default { name: data.name, once: data.once, Impl };
