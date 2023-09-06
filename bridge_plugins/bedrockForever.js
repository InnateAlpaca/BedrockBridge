/**
 * bedrockForever - BedrockBridge Plugin
 * 
 * This bridge plugin will modify discord chat so that only bedrock nametag will be displayed for all events and chat.
 * E.g. if a player sends a message, the author of the message displayed will be the nametag of the player (and not the username).
 * You can modify the nametags of players by running /rename
 * Note: despite it will make chat look better, it may make hard to run commands as to run commands you need as always the username, 
 * and not the nametag.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca) 
 */

import { world, Player } from '@minecraft/server'
import { bridge } from '../addons'

bridge.events.chatUpStream.subscribe(async(e, player)=>{
    e.author=player.nameTag.toDiscord();
})

bridge.events.playerDieLog.subscribe(async(e, player, damage)=>{
    e.message=e.message.replace(player.name, player.nameTag.toDiscord());
    if (damage.damagingEntity instanceof(Player))
        e.message=e.message.replace(damage.damagingEntity.name, damage.damagingEntity.nameTag.toDiscord());
})

bridge.events.playerJoinLog.subscribe(async(e, player)=>{
    e.user=player.nameTag.toDiscord();
})

bridge.events.playerLeaveLog.subscribe(async(e, player)=>{
    e.user=player.nameTag.toDiscord();
})

bridge.events.petDieLog.subscribe(async(e, pet, damage)=>{
    if (damage.damagingEntity instanceof(Player))
        e.message=e.message.replace(damage.damagingEntity.name, damage.damagingEntity.nameTag.toDiscord());
})

world.beforeEvents.chatSend.subscribe(e=>{
    // you may want to comment this whole thing as it may interfere with other addons. 
    // This is most definitely not compatible with other chat-ranks
    if (e.sender.nameTag!==e.sender.name){
        e.cancel=true;
        world.sendMessage(`<${e.sender.nameTag}§r> ${e.message}`);
    }    
})

