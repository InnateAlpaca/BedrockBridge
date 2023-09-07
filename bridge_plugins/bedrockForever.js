/**
 * bedrockForever - BedrockBridge Plugin
 * 
 * This bridge plugin will alter Discord chat to exclusively show the bedrock nametags for all events and chat interactions. 
 * For example, when a player sends a message, the displayed author will be their nametag, not their username. 
 * You can adjust player nametags using the /rename command. However, please note that while this enhances the chat's appearance, 
 * it may complicate command execution since you will always need to use the username, not the nametag, when running commands.
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

// bridge.events.playerLeaveLog.subscribe(async(e, player)=>{
//     e.user=player.nameTag.toDiscord();
// })

bridge.events.petDieLog.subscribe(async(e, pet, damage)=>{
    if (damage.damagingEntity instanceof(Player))
        e.message=e.message.replace(damage.damagingEntity.name, damage.damagingEntity.nameTag.toDiscord());
})

// world.beforeEvents.chatSend.subscribe(e=>{
//     // you may want to comment this whole thing as it may interfere with other addons. 
//     // This is most definitely not compatible with other chat-ranks
//     if (e.sender.nameTag!==e.sender.name){
//         e.cancel=true;
//         world.sendMessage(`<${e.sender.nameTag}§r> ${e.message}`);
//     }    
// })

