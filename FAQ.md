# FAQ
We thought that you may have some questions about our bot, so here is a small Q&A. We hope that this will help you!

### How does this work?
When you install *minecraft-addon* your server will be able to connect to the BedrockBridge discord bot. If you invite this bot to your discord server, chat will be streamed and you will be able to run several useful commands form discord.
So this is the configuration:
* Minecraft-Server <-> BedrockBridge Bot <-> DiscordServer

### It doesn't work! What should I do?
First thing to do is understanding where the problem is:
* Does the addon work at all? Log into your bedrock server and run `!status` in chat. If you simply see in chat "!status" then the addon is not working. Most common reasons for this error are: 
  * Your world doesn't have *experiments* on.
  * You are using the wrong version: there is a version of this pack for each major minecraft update. Versions are not interchangeable (you need to instal the right one). Check the github [*tags*](https://github.com/InnateAlpaca/BedrockBridge/tags) for the right one.
* Nice it works... but it says "offline". Then your server was not able to connect to the bot, try to run in chat `!messages` and see if is there any. Most probable issue is:
  * You haven't added the token to the [config file](BedrockBridge#bedrock-setup) (or your token is no longer valid, in this case request a new one from your discord server).
* Nope that was all fine, but I still can't see the chat! Well, in this case the problem is with discord setup. 
  * make sure that you ran `/setup` on your discord server
  * try to reinvite the bot
  * give the bot ADMIN permissions. (Some servers have options that will prevent the bot from setting up webhooks)

If you are still having troubles don't hesitate to **contact us** on the [official discord](https://discord.gg/A2SDjxQshJ) or open a [ticket](https://github.com/InnateAlpaca/BedrockBridge/issues) here on github.

*Note: Github tickets will typically take longer to be addressed than discord reports.*

### It doesn't work since February 2024!
Hello if you are having connection issues and error logs on your screen, that's because we updated the discord bot address. So all older packs won't be able to connect to it anymore. *How should I fix it?*
* If you are running the **latest** version of minecraft bedrock edition you can just install the newer version we released. Or override the `main.js` (from the addon files) with the new one.
* If you are running an older version of BedrockBridge (v1.3.4 or lower) you need to manually fix it, as we won't release an official fix for them.
  - go in the addon files and find `main.js` 
  - Open it and find the string `ismp.space` (you can use *CTRL+F*)
  - Now replace it with `i.space`


### How is it possible that everyone can run all commands??
Yes, some bots let you choose what roles can run certain commands, why does this bot not do it? well because discord already allows you to do that natively! 

**How?**
Go to `Menu->Integrations->BedrockBridge` and you will find a list of commands. You can chose what roles can run bot's commands, and what channels can the commands be run from. Then you can even customise single commands' permissions. 
Here's an example ![discord_setup](https://i.imgur.com/QRKOWRb.png) 

### Updating the pack: how do I do?
Installing them on your server is very easy:
1) download the new pack and unzip server_pack.
2) now take the content of development_behaviour_pack folder and past it into the folder with the same name on your server-folder (replacing the old existing one). 
3) when you restart the server the new version will be working (but you don't need to do it immediately).
Note another way to summarize this is "replace the old `main.js` with the new `main.js`.

### I'm on Aternos, why does it keep saying that the token is not valid? I've changed it like a hundred times now!
* If you did *in-game* installation reopen setup form (by running `scriptevent esploratori:setup`) and fill the _origin_ box. **What should I put in there?** Just the domain of your server, which will typically be something like *\<name\>.aternos.me*, you can find that in your aternos panel `Server>Address`.
* If you used *file* setup go to `config/variables.json` and add this entry `"origin": "<your server address>"`, where *\<your server address\>* is the address you use to connect to the server (typically with this format *\<name\>.aternos.me*) *Tip: make sure that all the commas in the json file are alright*.
 
 **Alright, but why was that?**
 Aternos, in order to grant everyone a server to play on, will start your world on a different node every time. This is in conflict with our bot mechanics, which uses location-secured tokens (tokens can only be used from a single server-address). Basically every time you start your aternos server you invalidate the old token. With BedrockBridge *1.2.1-alpha* we introduced the *origin* option which gets around this problem (linking your token to server-origin rather than server-address). Origin option can also be used by people owning a domain, if they want.

 ### I've seen that there's "bridge-plugins": What is it?
Bridge plugins are extensions to the default BedrockBridge addon and they allow you to enhance its capabilities or changing its behaviour. They can be made by anyone, you just need to know a bit of code. You can find a list of verified plugins in [here](https://github.com/InnateAlpaca/BedrockBridge/tree/main/bridge_plugins)!

### That's cool, but how do I a install bridge-plugin?
It's very easy! 
* Navigate in your server files to `behavior_packs/BedrockBridge/scripts/bridgePlugins` and paste in there your plugin (usually a file ending in .*js*).
* Open the file `index.js` and add a new line (enter) now type `import "./\<name of plugin\>"` You don't need to put the file extension *.js*

That's it!
*Note: there may be different instructions for installation, open the file and read in the header if there is any special installation procedure.*

