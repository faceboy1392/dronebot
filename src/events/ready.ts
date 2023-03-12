import { EventData, EventExecutable } from "../classes/Event";
import Bot from "../classes/Bot";
import Commandler from "../util/Commandler";
import { ActivityType, Client } from "discord.js";

const data: EventData = {
  name: "ready",
  once: true,
};

class Impl extends EventExecutable {
  async execute(bot: Bot, client: Client) {
    console.log(`ONLINE as ${client.user.tag}`);
    console.log(`Guilds: ${client.guilds.cache.size}`);

    client.user.setActivity({ name: "Nimbatus", type: ActivityType.Playing, url: "https://i.imgur.com/g8YLdP0.png" });

    const commandler = new Commandler(bot);
    bot.commandler = commandler;
    await commandler.startup();
  }
}

export default { name: data.name, once: data.once, Impl };
