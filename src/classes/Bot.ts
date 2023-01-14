import { Client, ClientOptions, Collection } from "discord.js";
import config from "../../config.json";

import { Command } from "./Command";
import { Event } from "./Event";

import logger from "../util/logger";

import Commandler from "../util/Commandler";

export default class Bot {
  client: Client;
  config = config;
  log = logger;
  commandler: Commandler;
  commands = new Collection<string, Command>();
  events = new Collection<string, Event>();

  constructor(options: ClientOptions) {
    this.client = new Client(options);
  }
}
