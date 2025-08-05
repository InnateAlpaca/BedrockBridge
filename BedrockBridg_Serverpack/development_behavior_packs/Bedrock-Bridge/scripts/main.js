/**
 * ************************** BedrockBridge v1.6.8 **************************
 * @version 1.6.8
 * Developed by Esploratori-Development https://discord.gg/esploratori-development-1043447184210792468
 * This addon connects your bedrock-dedicated-server to your discord server through 
 * an external discord bot. More info at https://github.com/InnateAlpaca/BedrockBridge
 * Invite the bot at https://discord.com/api/oauth2/authorize?client_id=1041838898843762769&permissions=2684357632&scope=bot%20applications.commands
 */

import { system } from "@minecraft/server"
system.run(async ()=>{
    await import("./bedrockbridge")
})

import { gameCommandManager } from "./GameCommandManager"
system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    gameCommandManager.registerCommands(customCommandRegistry);
})