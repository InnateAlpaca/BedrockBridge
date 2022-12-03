# BedrockBridge
BedrockBridge is a discord bot that connects your discord-server to your bedrock-server. This solution is specifically for BDS (Bedrock Dedicated Server) but it can also be used on any bedrock server. All you need to do in order to use this bot is [inviting](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) the bot to your discord-server, and installing the addon in your bedrock-server. That's all you need to do. (check installation for more details about this procedure).

[Official Discord Server](https://discord.gg/A2SDjxQshJ)
Here you can get help and download the latest version of the pack, find a full installation tutorial, try the pack without installing it on our test-server. 

## Installation
Short version (for expert users only) is this: invite bot, run `/setup`, download *worldpack* and add it to your world, enable experiments, install the *serverpack* on your server, navigate to `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/secrets.json` and insert the token that you get from discord by running `/new-token`.
That's it.

If you are not an expert user you may want to take a look at the following guide. More info about installing addons on servers (in general)) can be found [here](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingservers).
### Discord setup
1. Invite BedrockBridge discord bot to your discord-server using this [link](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands)
2. Choose the channel you want to have bedrock-chat streamed to and run `/setup` in it
3. Request a new token by running `/new-token`. Keep it safe.
### Bedrock setup
4. Download *BedrockBridge_worldpack.mcpack*, and add it to your minecraft launcher, by double clicking it.
5. Open your world's settings (from minecraft launcher), add the pack and **enable** experimental features (now called **beta API**).

*note: if you are not doing this on a new world (from *new world* settings menu) and you didn't have experiments enabled, mc has generated a copy of your world with experiments enabled. THIS is the world you need to use from now on (not the original version).*

6. Copy this world from minecraft worlds folder (usually `%LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\minecraftWorlds`) to your server's folder (`<server-main-folder>/worlds`)
7. Download *BedrockBridg_Serverpack.zip* and unzip it inside your main server folde. (e.g. *select where would you like to unip files to: `.../<server-main-folder>`*)
8. Copy the token from step 3, navigate to `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/` and open *secrets.json*. Now replace the vauel after "token" with your token.
9. (Optional) you can edit *varibles.json* in order to enable or disable certain functionalities.
10. Start your server and enjoy streamed chat and commands!
