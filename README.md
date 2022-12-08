# BedrockBridge
BedrockBridge is a discord bot that connects your discord-server to your bedrock-server. This solution is specifically for BDS (Bedrock Dedicated Server) but it can also be used on any bedrock server. All you need to do in order to use this bot is [inviting](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) the bot to your discord-server, and installing the addon in your bedrock-server. That's all you need to do. (check installation for more details about this procedure).

[Official Discord Server](https://discord.gg/A2SDjxQshJ)
Here you can get help and download the latest version of the pack, find a full installation tutorial, try the pack without installing it on our test-server. 
You can also contact us by [email](mailto:development@esploratorismp.space).

## Installation
Short version (for expert users only) is this: [invite](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) bot, run `/setup`, download *worldpack* and add it to your world, enable experiments, install the *serverpack* on your server, navigate to `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/secrets.json` and insert the token that you get from discord by running `/new-token`.
That's it.

If you are not an expert user you may want to take a look at the following guide. More info about installing addons on servers (in general) can be found [here](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingservers).
### Discord setup
1. Invite BedrockBridge discord bot to your discord-server using this [link](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands)
2. Choose the channel you want to have bedrock-chat streamed to and run `/setup` in it
3. Request a new token by running `/new-token`. Keep it safe.
### Bedrock setup
4. Download *BedrockBridge_worldpack.mcpack*, and add it to your minecraft launcher, by double clicking it.
5. Open your world's settings (from minecraft launcher), add the pack and **enable** experimental features (now called **beta API**).

*note: if you are not doing this on a new world (from *new world* settings menu) and you didn't have experiments enabled, mc has generated a copy of your world with experiments enabled. THIS is the world you need to use from now on (not the original version).*

6. Copy this world from minecraft worlds folder (usually `%LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\minecraftWorlds`) to your server's folder (`<server-main-folder>/worlds`)
7. Download *BedrockBridg_Serverpack.zip* and unzip it inside your main server folder. (e.g. *select where would you like to unzip files to: `.../<server-main-folder>`*)
8. Copy the token from step 3, navigate to `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/` and open *secrets.json*. Now replace the value after "token" with your token.
9. (Optional) you can edit *variables.json* in order to enable or disable certain functionalities.
10. Start your server and enjoy streamed chat and commands!

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
