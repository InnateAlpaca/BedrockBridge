/**
 * gameModes @version 1.0.0 - BedrockBridge Plugin
 * 
 * This bridge-addon sends logs to discord if some player changes gamemode. This is a very effective way both to detect hackers and unstrustworthy staff.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

import { world } from "@minecraft/server";
import { bridge } from "../addons";
import { bridgeDirect } from "../BridgeDirect";

bridge.events.bridgeInitialize.subscribe(e => {
    e.registerAddition("discord_direct"); //enabling direct messages
})

world.afterEvents.playerGameModeChange.subscribe(e=>{
    if (bridgeDirect.ready && e.fromGameMode!==e.toGameMode && e.player.typeId==="minecraft:player"){
        bridgeDirect.sendEmbed({ title: "Gamemode Change", description: `"${e.player.name}" *(${e.player.id})* has changed gamemode.\n- ${e.fromGameMode} → ${e.toGameMode}.`, color: 0x99aab5})
    }
})