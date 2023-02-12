import { EventData, EventExecutable } from "../classes/Event";
import Bot from "../classes/Bot";
import logger from "../util/logger";
import { GuildMember } from "discord.js";

const data: EventData = {
  name: "guildMemberUpdate",
  once: false,
};

class Impl extends EventExecutable {
  async execute(bot: Bot, old: GuildMember, member: GuildMember) {
    if (member.id === member.guild.members.me.id) {
      if (old.nickname !== member.nickname) {
        member.guild.members.me.setNickname(old.nickname);
      }
    }
  }
}

export default { name: data.name, once: data.once, Impl };
