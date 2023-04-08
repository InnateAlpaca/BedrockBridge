# Documents and usage
BedrockBridge is a *minecraft-addon + discord-bot* combo that will allow you to connect your server to discord with very low effort. 
### How does it work?
When you install *minecraft-addon* your server will be able to connect to the BedrockBridge bot. If you invite this bot to your discord server, chat will be streamed and you will be able to run several useful commands form discord.
So this is the configuration:
* Minecraft-Server <-> BedrockBridge Bot <-> DiscordServer

Now we will list all the commands that you can currently run on your discord server as well as commands that you can run on your bedrock-server.

## Discord commands
Regular commands can be run by any server owner (as long as they are at the least Admin of their discord server)
### help
Find all you need to get started with BedrockBridge Bot.
### setup
* channel (optional): channel

Set up your server, initialize it. You need to run it in order to be able to do anything else with the bot. If you select a channel, that channel will be used for streaming chat, otherwise the bot will use the channel where the command has been run.
### new-token
Generate a new token for your server. Note: once you did this your old token won't be valid anymore and you won't be able to connect with your server unless you use the new token. Reasons to change token can be because you leaked the old one, or because you changed your server's ip (in fact each token can only be used from 1 ip).
### command
* command: mc command to run, without `/`.

Run a command on the bedrock server.
### ban
* username: 

Ban a player from your server. Note: this is not a top-security solution. If you are dealing with hackers you should use whitelist. If the player you want to ban is not online, player will be added to a *temp-ban* list, and ban will become effective the first time this player tried to join the world. This list resets when server restarts, so be aware that player might not have been effectively banned yet when you restart. When the player is effectively banned you will still receive a message telling you so.
### unban
* username
### rename
* username
* nametag

Change nametag above a player in game. This command is not persistent. The nametag will remain until the player leaves the server.
### mute
* username

Mute a player on the server. Note: they will still be able to chat using `/me` of `/say` (if they know about it).
### unmute
* username
###  find
* username

get a player's location
### inventory
* username

visualize player inventory's content
### kill
* username

### list
List all players online
### gamemodes
Lists all player and their gamemodes
### proximity 
* enabled: boolean
* distance: number

Enable/disable proximity chat, or set the distance. Players will be only able to read each other's messages if they are less than a certain distance far away.

 ## Bedrock commands
 These commands can be used from the bedrock chat, adding before the prefix you chose (or default one `!`) e.g. `!help`. You can change the prefix in `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/variables.json`.
 Commands that can be run from bedrock-server are very limited as this pack's purpose is providing discord-support rather than in-game support.
 ### help
 Returns a list of commands that you can use.
 ### connect
 If the server disconnects from the bot for some reason, you can run this in order to reconnect.
 ### messages
 If the server got disconnected from the bot for some reason (bad token, connection error, wrong ip...) it will be logged here.
 ### status
 Current status of the server (starting, online, sleeping, offline)
 ### logging
 * value: accepts `on` or `off`
 
 Enable error logging. If there is any internal or external error it will be logged in chat.
 
 ## Config options
 You can customize some functionalities of the pack from the following folder `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/variables.json`. *Note: changes to these settings will become effective only after server restart*.
 
 ### prefix
 * option: char (any single character)
 Bedrock commands prefix, default value is `!`, and you can change it to whatever you prefer (some commonly used options are e.g. `.` and  `?`)
 
 ### mute_capability
 * option: boolean (true/false)
 This option enables/disables the discord command [`/mute`](DOCS.MD#mute)
 
  ### ban_capability
 * option: boolean (true/false)
 This option enables/disables the discord command [`/ban`](DOCS.MD#ban)
 
   ### proximity_chat
 * option: boolean (true/false)
 This option enables/disables the proximity chat. What's that? Proximity chat will allow players to send regular messages **only** to players within a certain radius from them: people will be able to communicate only if they are close one to another, which is a nice thing for servers where people should interact.
 
   ### proximity_distance
 * number
 If proximity chat is enabled this option will set how many blocks away players can be in order to receive other players messages.
 
 
