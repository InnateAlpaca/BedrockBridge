/**
 * deviceBan @version 1.0.0 - BedrockBridge Plugin
 * 
 * This bridge-addon will kick any player joining with a device type that is not allowed, reporting the attempt to discord.
 * 
 * example: BANNED_DEVICES = [PlatformType.Desktop, PlatformType.Mobile]
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */
import { PlatformType, system } from "@minecraft/server";

const BANNED_DEVICES = [] // here you can add the devices you want to be banned. Options are: Desktop, Console, Mobile
const SEND_LOG = true // send a log to discord when a player tries to connect with a banned device

import { world } from "@minecraft/server";
import { bridge } from "../addons";
import { bridgeDirect } from "../BridgeDirect";

bridge.events.bridgeInitialize.subscribe(e => {
    e.registerAddition("discord_direct"); //enabling direct messages
})

const kickList = new Set(); // for removing join/leave logs for kicked players

bridge.events.playerJoinLog.subscribe((e, player)=>{
    if (kickList.has(player.id)){
        e.cancel=true;
    }
})

bridge.events.playerLeaveLog.subscribe((e, player) => {
    if (kickList.has(player.id)) {
        e.cancel = true;
        kickList.delete(player.id)
    }
})

world.afterEvents.playerSpawn.subscribe(e => {
    if (!e.player) return; // fake players
    
    const device = e.player.clientSystemInfo.platformType.toString();
    const {id, name} = e.player;
   
    if (BANNED_DEVICES.includes(device)){
        kickList.add(id);
        if (SEND_LOG && bridgeDirect.ready){
            bridgeDirect.sendMessage("hello dude"+device)
            bridgeDirect.sendEmbed({
                title:"Player Removed",
                description: `"${name}" *(${id})* tried to connect with \`${device}\` and has been removed from the game.`,
                color: 9807270
            }, "Device Detector")
        }
        e.player.runCommandAsync(`kick "${name}" Bad device detected`)
    }
})