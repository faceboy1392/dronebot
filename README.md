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
1. Download the source code for this repo
1. Open a terminal like cmd or Bash, and move to the folder you downloaded the code into
1. Type `npm run start` and hit enter
