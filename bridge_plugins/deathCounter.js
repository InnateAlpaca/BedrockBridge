import { world, Player } from '@minecraft/server';
import { bridge } from '../addons';

const death_obj = world.scoreboard.getObjective("deaths")??world.scoreboard.addObjective("deaths", "deaths");
const kills_obj = world.scoreboard.getObjective("kills")??world.scoreboard.addObjective("kills", "playerKills");
const mob_kills_obj = world.scoreboard.getObjective("mob_kills")??world.scoreboard.addObjective("mob_kills", "mobKills");

world.afterEvents.entityDie.subscribe(e=>{
    if (e.deadEntity instanceof(Player))
        e.deadEntity.runCommandAsync("scoreboard players add @s deaths 1");
    else if (e.damageSource.damagingEntity instanceof(Player)){
        e.damageSource.damagingEntity.runCommandAsync("scoreboard players add @s mob_kills 1");
    }
    if (e.damageSource?.damagingEntity instanceof(Player)){
        e.damageSource.damagingEntity.runCommandAsync("scoreboard players add @s kills 1");
    }
})

bridge.bedrockCommands.registerCommand("mystats", (player)=>{
    if (player.scoreboardIdentity){
        player.sendMessage(
            "\nHere are your scores:\n"+
            `- §oNumber of deaths:§r ${death_obj.getScore(player.scoreboardIdentity)}\n`+
            `- §oNumber of kills:§r ${kills_obj.getScore(player.scoreboardIdentity)}\n`+
            `- §oMobs killed:§r ${mob_kills_obj.getScore(player.scoreboardIdentity)}\n`
        )        
    }
    else {
        player.sendMessage("§cThere is no registered score for you.")
    }    
}, "Get death and kill stats about yourself")