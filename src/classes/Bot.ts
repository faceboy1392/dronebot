import { Client, ClientOptions, Collection } from "discord.js";
import config from "../../config.json";

import { Command } from "./Command";
import { Event } from "./Event";

import Commandler from "../util/Commandler";

export default class Bot {
  client: Client;
  config = config;
  commandler: Commandler;
  commands = new Collection<string, Command>();
  events = new Collection<string, Event>();

  constructor(options: ClientOptions) {
    this.client = new Client(options);
  }
}
