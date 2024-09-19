/**
 * StepCounter (Players walking distance) @version 1.1.0 - BedrockBridge Plugin
 * 
 * This bridge plugin lets you inquiry the distance a player has been walking on a server.
 * It handles info as scoreboard, so you can gather it from discord by running /stats.
 * You have two scoreboards: one for session time (in minutes), the other for overall time (in minutes). 
 * The latter is updated when the player leaves the server, while the first is updated each minute.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca) 
 */


import { bridge } from "../addons";
import { world, system } from "@minecraft/server";

function distance(v1, v2){// Vector mock as @minecraft/math requires manifest change
    return Math.sqrt((v1.x-v2.x)**2+(v1.y-v2.y)**2+(v1.z-v2.z)**2);
}

const stepScoreboard = world.scoreboard.getObjective("esploratori:steps")??world.scoreboard.addObjective("esploratori:steps", "steps");

bridge.bedrockCommands.registerCommand("steps-count", (player)=>{
    player.sendMessage(`§eYou have been walking for §o${stepScoreboard.getScore(player)}§r§e blocks`)
}, "returns the distance you have been walking (in block unit).");

bridge.bedrockCommands.registerAdminCommand("reset-steps", (player, target) => {
    const targetPlayer = target?.readPlayer();
    if (targetPlayer){
        system.run(()=>{
            stepScoreboard.setScore(targetPlayer, 0);
            player.sendMessage(`§eStep counter score reset to 0 for §o${targetPlayer.name}§r.`)
        })        
    }
    else {
        player.sendMessage(`§cTarget player not found online.`)
    }        
}, "resets the distance a player has been moving for.");

const player_locations = new Map();
const player_dimensions = new Map();

system.runInterval(()=>{
    for (const player of world.getAllPlayers()){
        if (player_dimensions.get(player.id)===player.dimension.id){
            const dist = distance(player.location, player_locations.get(player.id));

            if (dist>1)
                stepScoreboard.addScore(player, Math.floor(dist));
            else continue // don't reset old location
        }
        else { // if dimension changes don't update the steps
            player_dimensions.set(player.id, player.dimension.id);
        }
        player_locations.set(player.id, player.location);
    }
}, 10)

world.afterEvents.playerSpawn.subscribe(e=>{
    if (e.initialSpawn) return;

    player_locations.set(e.player.id, e.player.location);
    player_dimensions.set(e.player.id, e.player.dimension.id);

    // Initialise steps score when player first joins
    if (!e.player.scoreboardIdentity || !stepScoreboard.hasParticipant(e.player.scoreboardIdentity)){
        stepScoreboard.addScore(e.player, 0);
    }    
})

world.afterEvents.playerLeave.subscribe(e=>{
    player_locations.delete(e.playerId);
    player_dimensions.delete(e.playerId);
})