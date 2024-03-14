/**
 * Esploratori Chat Rank for BedrockBridge
 * @version 1.1.0
 * 
 * This bridge-plugin will transform your bedrock chat letting you use chatranks! ranks are set simply by adding a tag starting with "rank:".
 * You can optionally setup a few rank-tags from settings.js where you can just use the color you want for the rank, and then assign them 
 * through the command "addTag" (bridge-command). 
 * 
 * From Settings.js you can as well setup a lot of other options! Even how chat should appear (chat template)!
 * You'll get of course discord messages formatted with discord-roles.
 * 
 * by InnateAlpaca102
 */

import { world, system } from '@minecraft/server';
import { bridge } from '../../addons';
import { settings } from './settings';
import { colors } from './data/colors';

const [t1, t2, t3, t4] = settings.template.split('%');

world.beforeEvents.chatSend.subscribe(e=>{
    if (e.message.startsWith(bridge.bedrockCommands.prefix) || settings.ignore_prefixes.includes(e.message.charAt(0))) return;

    if (settings.change_nametags && settings.use_nametags){
        world.sendMessage(e.sender.nameTag + t3 + e.message + t4);
    }
    else{
        world.sendMessage(t1 + (e.sender.getTags().filter(t=>t.startsWith("rank:"))[0]??settings.default_rank).slice(5) + 
                          t2 + ((settings.use_nametags)?e.sender.nameTag:e.sender.name) + 
                          t3 + e.message + t4);
    }
    
    e.cancel=true;
})

if (settings.change_nametags){
    for (const player of world.getAllPlayers()){
        player.nameTag= t1 + (player.getTags().filter(t=>t.startsWith("rank:"))[0]??settings.default_rank).slice(5) + t2 + player.name;
    }

    world.afterEvents.playerSpawn.subscribe(e=>{
        e.player.nameTag= t1 + (e.player.getTags().filter(t=>t.startsWith("rank:"))[0]??settings.default_rank).slice(5) + t2 + e.player.name;
    })
}

bridge.events.bridgeInitialize.subscribe(e=>{
    e.registerAddition("discord_roles");
})

bridge.events.chatDownStream.subscribe(e=>{
    world.sendMessage(t1 + "§9"+(e.roles[0]??settings.default_rank.slice(5))+"§r" + 
                      t2 + e.author +
                      t3 + e.message + t4);
    e.cancel=true;
})

bridge.events.chatUpStream.subscribe((e, player)=>{
    if (settings.change_nametags && settings.use_nametags){
        e.author = (player.nameTag).toDiscord();
    }
    else{
        e.author = (t1 + (player.getTags().filter(t=>t.startsWith("rank:"))[0]??settings.default_rank).slice(5)+
                t2 + ((settings.use_nametags)?player.nameTag:player.name)).toDiscord();
    }
    
})

bridge.bedrockCommands.registerAdminCommand("addTag", (player, user, role)=>{
    const target = user.readPlayer();
    if (target && role in settings.roles){
        system.run(()=>{
            target.getTags().forEach(t=>{
                if (t.startsWith("rank:"))
                    target.removeTag(t)
            })
            target.addTag("rank:"+colors[settings.roles[role]] + role);
            player.sendMessage("§eTag added.");
        })        
    }
    else {
        player.sendMessage("§cWrong command usage. Usage: addTag <username> <tag>\n§r§oNote: tag must be a registered tag");
    }

}, "add a chat rank to a target player. Usage: addTag <username> <tag>")