# Faceboy's drone bot
*Designed by faceboy#1392*

A simple little bot designed primarily for the Discord server of the game *Nimbatus: The Space Drone Constructor.*

This bot will take any `.drn` zip files (which store drones in Nimbatus) and yoinks the drone image and some metadata to preview the drone in the channel.

[-] Zero configuration needed
[-] Entirely free to use
[-] It just works

## Add to server

You can add it to your server [by clicking this link](https://discord.com/api/oauth2/authorize?client_id=1060614689173807225&permissions=34816&scope=bot%20applications.commands).

It requires **zero** configuration, it'll just work from the moment you add it to the server. If you want to configure channels that the bot will not automatically watch for new `.drn` files, just remove the bot's "Send Messages" permission in those channels.

## About

An older bot, *Bob, the Space Drone Analyzer*, was designed by a different developer for the same purpose, but was eventually deleted, so this bot was made from the ground up to replace it. Free to use, open source, no nonsense.

## How it works

If a message contains a valid `.drn` file, the bot will automatically reply to the message with a preview of the stored drone. 

If a message contains *multiple* `.drn` files, the bot will just preview the first one and ignore the rest.

If the bot misses a specific message containing a `.drn` file (such as if the bot is offline when the message is sent), then you can alternatively click the message, and under "Apps" click "Preview drone" to manually create a preview.

## How to host it yourself

The bot is fully available, but if for whatever reason it becomes unavailable, you can host the bot yourself on your own computer or on a hosting service like Vercel.

To host it yourself:
1. Download [NodeJS](https://nodejs.org/en/)
1. Download the source code in this repo and put it all in a folder
1. Create a Discord bot application
> Navigate to the Discord Developer Portal, and create a new Application
> In the application, fill out the information it asks for, then create and customize the actual bot under the `Bot` tab
> Copy the bot's token. Do not give this token out to anyone.
1. In the source code root folder, *not within `src`*, create a file called `.env`
1. Open that file and type `TOKEN=` and paste the token you copied previously, nothing else 
1. Open a terminal like cmd or Bash, and navigate to the folder with the code
1. Type `npm install` and hit enter, and wait for it to finish installing dependencies
1. Type `npm run start` and hit enter

To add the custom bot to a server, just follow [this guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links). It is part of a guide for Discord.js, a library used for creating Discord bots (including this one), but that specific page is relevant to Discord in general.
