/**
 * stepCounter (Players walking distance) - BedrockBridge Plugin
 * 
 * This bridge plugin lets you inquiry the distance a player has been walking on a server.
 * It handles info as scoreboard, so you can gather it from discord by running /stats.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca) 
 */


import { bridge } from "../addons";
import { world, system, Vector } from "@minecraft/server";

const stepScoreboard = world.scoreboard.getObjective("esploratori:steps")??world.scoreboard.addObjective("esploratori:steps", "steps");

bridge.bedrockCommands.registerCommand("steps-count", (player)=>{
    player.sendMessage(`§eYou have been walking for §o${stepScoreboard.getScore(player)}§r blocks`)
}, "returns the distance you have been walking (in block unit).");

const player_locations = new Map();
const player_dimensions = new Map();

system.runInterval(()=>{
    for (const player of world.getAllPlayers()){
        if (player_dimensions.get(player.id)===player.dimension.id){
            const dist = Vector.distance(player.location, player_locations.get(player.id));
            stepScoreboard.addScore(player, Math.ceil(dist));
            world.sendMessage(dist.toString())
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