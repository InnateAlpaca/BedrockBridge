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

Change nametag above a player in game. This command is persistent since BedrockBrodge 1.2.0 (nametag will remain untill you change it).
### mute
* username

Mute a player on the server. Note: they will still be able to chat using `/me` or `/say` (if they know about it).
### unmute
* username
###  find
* username

get a player's location. Its dimension is shown by a block image (dirt for overworld, netherrak for nether, endstone for end).
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
### claimdc
* token

Your chat from bedrock will now be streamed showing your discord nametag, and discord picture. In order to "link" your accounts (as for chat-display) run `!linkdc` on bedrock-chat and wait for the token. When you receive the token go in discord and run `/claimdc <token>`. You need to be online during the whole procedure. The token will expire after a few minutes.

Enable error logging. If there is any internal or external error it will be logged in chat.

### kick
* username

Will kick this username from the server.

## Bedrock commands
These commands can be used from the bedrock chat, adding before the prefix you chose (or default one `!`) e.g. `!help`. You can change the prefix in`<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/variables.json`.
Commands that can be run from bedrock-server are very limited as this pack's purpose is providing discord-support rather than in-game support.
### help
Returns a list of commands that you can use.
### connect
If the server disconnects from the bot for some reason, you can run this in order to reconnect.
### linkdc
You will receive a token which you can use on discord (`/claimdc`) so that all your messages will be streamed showing your discord-name, and discord-pfp.
### unlink
Reset your discord chat-stream appearence: picture and discord-name will be deleted. From next login your pfp will reset to xbox-pfp, your name to your nametag.
### messages
If the server got disconnected from the bot for some reason (bad token, connection error, wrong ip...) it will be logged here.
### status
Current status of the server (starting, online, sleeping, offline)
### logging
* value: accepts `on` or `off`

## Config options
You can customize some functionalities of the pack from the following folder `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/variables.json`. *Note:changes to these settings will become effective only after server restart*.

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

This option enables/disables the proximity chat. What's that? Proximity chat will allow players to send regular messages **only** to players within a certain radiusfrom them: people will be able to communicate only if they are close one to another, which is a nice thing for servers where people should interact.

### proximity_distance
* number

If proximity chat is enabled this option will set how many blocks away players can be in order to receive other players messages.
 
### discord_link
* boolean (true/false)

Allow people to have their discord-pfp and discord-name displayed in discord when they write in chat (instead of xbox pfp, and nametag). You may want to disable this if people are using it in order to trick your mods. 

### startup_notify
* boolean (true/false)

Get a notification every time your server starts (actually when the script is started).

### origin
* domain (e.g. `myserver.aternos.me`)

This option is dedicated to people running a server on free hosting companies, or people who have to change server-address very often. This option will keep your token valid even if you are connecting from a different server-address, as long as the domain you added here is pointing to that origin.
 
## Customise.js
Customise.js is a file inside `BedrockBridge/scripts` folder. Modifying it you can change BedrockBridge behaviour, develop plugins for the bot and share them!

### chat-stream functions
Inside the file you will find two functions named `downStreamMessage` and `upStreamMessage`. These functions are documented, which should help you to see how to change them.
* `downStreamMessage`

This function will modify how messages from discord are shown in your bedrock-chat, this can be integrated with chat-roles, or chat-colors (you can check (this)[https://www.digminecraft.com/lists/sign_color_list_bedrock.php] for more details). Information you get is sender discord-displayname, message, and [roles](https://www.itgeared.com/how-to-get-role-id-on-discord.php) of the sender (as ids).
* `upStreamMessage`

This function will modify how chat bedrock-chat is displayed on discord: you can change the name of the sender and content of the message. You will typically want to change `player.nick` (which is a custom property returning discord-nametag if it's definied, xbox nametag otherwise) to `player.nametag` or `player.name` (xbox username). Still you may want to show differently chat from special users such as ops, mods, or people having special tags (e.g. `player.hasTag('MOD')`).
### ignore logs
* `ignore_death`
Prevent embed being sent for certain players. Can be dynamically changed.

* `ignore_log`
Same as above, won't send login/logout embeds for this player.

* `ignore_chat`
chat for this player won't be streamed. Consider using `/mute` as a punitive measure intead of this.

### commands.js
This is a different file from Customise.js. It contains a list of commands that can be run from discord with `/command`. You can allow/disallow any command you want. In order to disable them all just delete the entire list (leaving an empty one). If you want to have only a few commands allowed remove all the others from the list.
