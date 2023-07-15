# BedrockBridge
* **Note**: if you can't connect your server using this bot please check [FAQ](FAQ.md), or ask for help on the [support server](https://discord.gg/A2SDjxQshJ).


BedrockBridge is a minecraft addon that connects your bedrock-server to your discord-server. This solution is intended especially for BDS (Bedrock Dedicated Server) but it can also be used on any bedrock server. All you need to do in order to use this bot is [inviting](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) the bot to your discord-server, and installing the addon in your bedrock-server. That's all you need to do. (check installation for more details about this procedure).

[Official Discord Server](https://discord.gg/A2SDjxQshJ)
Here you can get help and download the latest version of the pack, find a full installation tutorial, try the pack without installing it on our test-server. 
You can also contact us by [email](mailto:development@esploratorismp.space).

*Is it up to date?* So far supported versions are: **1.19.50, 1.19.60, 1.19.70, 1.19.80, 1.20.0, 1.20.10** (latest), and minor following updates. You need to install the right addon version for each mc-version (check the tags for the right one).


Feel free also to check our [FAQ](FAQ.md) and [DOCS](DOCS.MD).

And if you want to donate you can do it [here](https://gofund.me/bdd174c3)!
## Installation
Short version (for expert users only) is this: [invite](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands) bot, run `/setup`, download *worldpack* and add it to your world, enable experiments, install the *serverpack* on your server, navigate to `<server-main-folder>/config/54d46e5d-b8c7-486f-8957-f83982bdfc2f/secrets.json` and insert the token that you get from discord by running `/new-token`.
That's it.

If you are not an expert user you may want to take a look at the following guide. More info about installing addons on servers (in general) can be found [here](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingservers). If you are having troubles setting up the addon you can also use the [auto-installer](https://bedrockbridge.esploratori.space/auto-installer.html) tool!

Don't forget to check our [YouTube](https://www.youtube.com/@Esploratori-Development/featured) tutorials: installation on [hosted servers](https://www.youtube.com/watch?v=10auxMSfVt8), and on [Aternos](https://www.youtube.com/watch?v=JlVKpC0o8jg)!
### Discord setup
1. Invite BedrockBridge discord bot to your discord-server using this [link](https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands)
2. Choose the channel you want to have bedrock-chat streamed to and run `/setup` in it.
3. Request a new token by running `/new-token`. Keep it safe.

**If the messages are not streamed and your server is connected, give the bot admin permissions, then run `/setup`.** Successful setup is needed in order to stream chat. If you need help don't hesitate to contact staff on the official discord server.
### Bedrock setup
4. [Download](https://github.com/InnateAlpaca/BedrockBridge/releases/latest) BedrockBridge addon.
5. **Enable** experimental features (now called **beta API**) on your world ([*yt*](https://youtu.be/10auxMSfVt8?t=97)).
6. Upload the folder called `Bedrock-Bridge` inside your server's `<server main folder>/behaviour_packs folder` ([*yt*](https://youtu.be/10auxMSfVt8?t=206)).
7. Go to `<server main folder>/worlds/<your world's name>/world_behavior_packs.json` and add the following line: `{ "pack_id" : "b17755d2-3cc0-424b-89dd-558fc98513f5", "version" : [ 0, 0, 1 ]}` (between the square brackets you find already there) ([*yt*](https://youtu.be/10auxMSfVt8?t=257))
8. Go to `<server main folder>/config` and paste the folder (from the downloaded pack) `config/b17755d2-3cc0-424b-89dd-558fc98513f5` ([*yt*](https://youtu.be/10auxMSfVt8?t=330))
9. Now copy your token (from step 3) and paste it to `<server main folder>/config/b17755d2-3cc0-424b-89dd-558fc98513f5/secrets.json` replacing the 0 valued token.
10. Start your server and enjoy streamed chat and [commands](https://www.youtube.com/watch?v=z4hX4c2QNjI)!

*Check the [documents](DOCS.MD) in order to see what commands you can run form discord, and enjoy!!*
