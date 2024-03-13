# BedrockBridge
* **Note**: if you can't connect your server using this bot please check [FAQ](FAQ.md), or ask for help on the [support server](https://discord.gg/A2SDjxQshJ).


BedrockBridge is a minecraft addon that connects your bedrock-server to your discord-server. This solution is intended especially for BDS (Bedrock Dedicated Server) but it can also be used on any bedrock server. All you need to do in order to use this bot is [inviting](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) the bot to your discord-server, and installing the addon in your bedrock-server. That's all you need to do. (check installation for more details about this procedure).

[Official Discord Server](https://discord.gg/A2SDjxQshJ)
Here you can get help and download the latest version of the pack, find a full installation tutorial, try the pack without installing it on our test-server. 
You can also contact us by [email](mailto:development@esploratorismp.space).

*Is it up to date?* So far supported versions are: **1.19.50, 1.19.60, 1.19.70, 1.19.80, 1.20.0, 1.20.10, 1.20.30, 1.20.40**, **1.20.50**, **1.20.60**, **1.20.70** (latest), and minor following updates. You need to install the right addon version for each mc-version (check the tags for the right one).


Feel free also to check our [FAQ](FAQ.md) and [DOCS](DOCS.MD).

And if you want to donate you can do it [here](https://gofund.me/bdd174c3)!
## Installation
Short version (for expert users only) is this: 
* [invite](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) bot, run `/setup`, install `Bedrock-Bridge.mcaddon` on your world. 
* Run `/scriptevent esploratori:setup` to start in-game configuration process, and fill in the form. 
* Run `connect` (with the prefix you chose) to connect your server.

If you are not an expert user you may want to take a look at the following guide. More info about installing addons on servers (in general) can be found [here](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingservers). If you are having troubles setting up the addon you can also use the [auto-installer](https://bedrockbridge.esploratori.space/auto-installer.html) tool!

Don't forget to check our [YouTube](https://www.youtube.com/@Esploratori-Development/featured) tutorials: installation on [hosted servers](https://youtu.be/1NTrhmW43eE), and on [Aternos](https://www.youtube.com/watch?v=JlVKpC0o8jg)!
### Discord setup
1. Invite BedrockBridge discord bot to your discord-server using this [link](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands)
2. Choose the channel you want to have bedrock-chat streamed to and run `/setup` in it.
3. Request a new token by running `/new-token`. Keep it safe.

**If the messages are not streamed and your server is connected, give the bot admin permissions, then run `/setup`.** Successful setup is needed in order to stream chat. If you need help don't hesitate to contact staff on the official discord server.
### Bedrock setup
4. [Download](https://raw.githubusercontent.com/InnateAlpaca/BedrockBridge/main/Bedrock-Bridge.mcaddon) BedrockBridge addon.
5. Install BedrockBridge addon on your world, making sure to enable experiments (**beta API**) and ignore console error logs[^1].
6. Upload the world back to your server.
7. Navigate to `<main folder>/config/default` and open `permissions.json`. Add the following line to the file `"@minecraft/server-net"` making sure that it respects JSON format[^2]. 
8. Start your server, join the game, and run `/scriptevent esploratori:setup`. Now fill the form. 

*Note: If you are not op or if cheats are disabled, in order to open the setup form please run the following command in server-console while you are connected to the server: `execute as <your username> run scriptevent esploratori:setup` (e.g. `execute as InnateAlpaca run scriptevent esploratori:setup`). Now close the chat and fill the form.*
[^1]: The error is caused by usage of modules that are server-only and can't be used in single world. The world will have no issue when running on a server.
[^2]: You can use [this tool](https://jsonchecker.com/) to verify if the modified file is valid, if it's invalid you are most surely missing some comma or quote.

*Check the [documents](DOCS.MD) in order to see what commands you can run form discord, and enjoy!!*

### Aternos
**New Installation for Aternos users** (since bridge 1.3.0)
* drop the .mcaddon pack into `Menu>Files>packs`
* enable `Worlds>Options>Beta API`
* start the server, go online, and run `/scriptevent esploratori:setup`. *Note: you **must** fill the `origin` parameter*

If you have problems you can refer to the new [youtube tutorial](https://youtu.be/1NTrhmW43eE), *Part IV* chapter.
