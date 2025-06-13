# Documents and usage
BedrockBridge is a *minecraft-addon + discord-bot* combo that will allow you to connect your server to discord with very low effort. 
### How does it work?
When you install *minecraft-addon* your server will be able to connect to the BedrockBridge bot. If you invite this bot to your discord server, chat will be streamed and you will be able to run several useful commands form discord.
So this is the configuration:
* Minecraft-Server <-> BedrockBridge Bot <-> DiscordServer

Now we will list all the commands that you can currently run on your discord server as well as commands that you can run on your bedrock-server.

## Discord commands
Regular commands can be run by any server owner (as long as they are at the least Admin of their discord server). You can also check [this clip](https://www.youtube.com/watch?v=z4hX4c2QNjI) showing all commands.
### help
Find all you need to get started with BedrockBridge Bot.
### setup
* channel (optional): channel

Set up your server, initialize it. You need to run it in order to be able to do anything else with the bot. If you select a channel, that channel will be used for streaming chat, otherwise the bot will use the channel where the command has been run.
### new-token
Generate a new token for your server. Note: once you did this your old token won't be valid anymore and you won't be able to connect with your server unless you use the new token. Reasons to change token can be because you leaked the old one, or because you changed your server's ip (in fact each token can only be used from 1 ip).

### announce
* message: message to be displayed

Sends a message to bedrock as announcement (doesn0t display user's name).

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
* time: (optional) mute duration, in minutes

Mute a player on the server. Note: they will still be able to chat using `/me` or `/say` (if they know about it).
### unmute
* username
###  find
* username

get a player's location. Its dimension is shown by a block image (dirt for overworld, netherrak for nether, endstone for end).
### inventory
* username

visualize player inventory's content

### echest
* username

visualize player inventory's ender chest.
### stats
* username

Get many useful info about a player: nametag, gamemode, level, health, isOp, location, spawn, join date, tags, scoreboard scores, device used, xuid.
### kill
* username

### list
List all players online

### gamemodes
Lists all player and their gamemodes

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
### deaf
Stop receiving messages from discord.
### undeaf
Resume receiving on your bedrock chat messages form discord.
## Config options
You can customize some functionalities of the pack from the following folder `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/variables.json`. 

*Note: changes to these settings will become effective only after server restart*.

*Note: You don't need to use config setup. You can now also use ingame setup.*

### prefix
* option: char (any single character)

Bedrock commands prefix, default value is `!`, and you can change it to whatever you prefer (some commonly used options are e.g. `.` and  `?`)

### discord_link
* boolean (true/false)

Allow people to have their discord-pfp and discord-name displayed in discord when they write in chat (instead of xbox pfp, and nametag). You may want to disable this if people are using it in order to trick your mods. 

### output
* integer

You can select the type of event display you prefer on discord. Available options are:
* 0: standard 
* 1: legacy

Standard output uses embeds for all events (playerDeath, join, leavel...) while legacy output display all event as plain text messages. You may want to switch to legacy if discord chat is being filled with event messages.

### startup_notify
* boolean (true/false)

Get a notification every time your server starts (actually when the script is started).

### shutdown_notify
* boolean (true/false)

Get a notification every time your server stops (actually when the connection with the server is lost).

### remote_transfer_disabled
* boolean (true/false)

Allow or disable player transfer to another server through discord `/transfer` command, or through bridge network request.

### partner_servers
* string

Comma separated list of allowed partner servers with the following format *displayName:host:port*. Where *displayName is the name players will be using in-game to transfer, *host* is the target ip/domain, and *port* is the target port.
```js
// Example for variables.json
{
    // ...
    "partner_servers": "funServer:play.example.com:19132,lifesteal:mc.games.fun:19220",
    // ...
}

```

### origin (optional)
* domain (e.g. `myserver.aternos.me`)

This option is dedicated to people running a server on free hosting companies, or people who have to change server-address very often. This option will keep your token valid even if you are connecting from a different server-address, as long as the domain you added here is pointing to that origin.
Since 04/2025 it's totally optional, and only used as an additional layer of security.

### allow_command_messages
* boolean (true/false)

If true bridgeDirect will also support events generated from commandblocks and NPCs.


## Bridge Direct
Bridge direct is an additional feature of BedrockBridge available since v1.4.0 that allows other addons to send messages to discord through our scriptevent API.
The supported standard is [MBAIS](https://gist.github.com/InnateAlpaca/14912b54d7c8eae860bd40929345c154).

Scriptevents can e run from other script-addons by command `world.runCommand("scriptevent " + JSON.stringify({/**...*/}))` or for more recent versions of mc `system.sendScriptEvent("discord:message", JSON.stringify({/**...*/}))`. 

Since v1.6.5 it's also possible to send message with NPC or command block commands if previously enabled from settings (see "allow_command_messages")

The available endpoints are the following.

### discord:message
Used to send a message to the chat.
```js
/scriptevent discord:message {"author":"GameNotification", "message": "Something happened in game!", "picture":"https://i.imgur.com/9y8IvBG.png"}
```
### discord:embed
Used to send an embed to the chat.
```js
/scriptevent discord:embed {"author":"GameNotification", "embed":{ "title": "Red alert!", "description": "Something red happened!", "color": 15548997 }}
```

### discord:ready
Scriptevent to be listened to in order to be notified if bridgeDirect is enabled and available (the scriptevent will be fired once the connection ahs been established and direct is ready to transmit).

If bridgeDirect is not available a notification will appear on console, but listening this event is the only way for other scripts to get information about the direct status.

## BridgeAPI
Since BedrockBridge v1.3.0 it's possible modify BedrockBridge addon through  custom api which is documented [here](https://github.com/InnateAlpaca/BedrockBridge/blob/main/docs/bridgeAPI/esploratori_bridge.md).

Bridge addons must be added to the folder `/Bedrock-Bridge/scripts/bridgePlugins`. Also in order to install it add an import statement inside `index.js`, as you can see in the examples.

You can find several examples of bridge-addons in [here](https://github.com/InnateAlpaca/BedrockBridge/tree/main/bridge_plugins).

## Customise.js (Old bridge scripting API)
If you are running a bridge version older than 1.3.0, you may be interested in this section where you can go through the earlier mod capabilities of bedrockbridge.
Customise.js is a file inside `BedrockBridge/scripts` folder. Modifying it you can change BedrockBridge behaviour, develop plugins for the bot and share them!

### chat-stream functions
Inside the file you will find two functions named `downStreamMessage` and `upStreamMessage`. These functions are documented, which should help you to see how to change them.
* `downStreamMessage`

This function will modify how messages from discord are shown in your bedrock-chat, this can be integrated with chat-roles, or chat-colors (you can check [this](https://www.digminecraft.com/lists/sign_color_list_bedrock.php) for more details). Information you get is sender discord-displayname, message, and [roles](https://www.sportskeeda.com/minecraft/minecraft-color-codes-bedrock-edition) of the sender (as ids).
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
