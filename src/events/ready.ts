import { EventData, EventExecutable } from "../classes/Event";
import Bot from "../classes/Bot";
import logger from "../util/logger";
import Commandler from "../util/Commandler";
import { ActivityType, Client } from "discord.js";

const data: EventData = {
  name: "ready",
  once: true,
};

class Impl extends EventExecutable {
  async execute(bot: Bot, client: Client) {
    logger.info(`ONLINE as ${client.user.tag}`);
    logger.info(`Guilds: ${client.guilds.cache.size}`);

    client.user.setActivity({ name: "Nimbatus", type: ActivityType.Playing, url: "https://i.imgur.com/g8YLdP0.png" });
    
    client.guilds.cache.get("369851421719527425").members.me.setNickname("robo L")

    const commandler = new Commandler(bot);
    bot.commandler = commandler;
    await commandler.startup();
  }
}

export default { name: data.name, once: data.once, Impl };
