import { bridge } from '../addons';
import {world} from "@minecraft/server"
/**
 * BlockStats - BedrockBridge addon 
 * @version 1.0.1
 * This add two scoreboard entries for mining stats. The scoreboard will appear on discord along with other stats when you run /stats or /lederboard commands
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * idea from  VinnyD369
 */

const breakScoreboard = world.scoreboard.getObjective("esploratori:blocks_broken") ?? world.scoreboard.addObjective("esploratori:blocks_broken", "blocks mined");
const breakScoreboardAll = world.scoreboard.getObjective("esploratori:blocks_broken_all") ?? world.scoreboard.addObjective("esploratori:blocks_broken_all", "blocks mined (overall)");

const placeScoreboard = world.scoreboard.getObjective("esploratori:blocks_placed") ?? world.scoreboard.addObjective("esploratori:blocks_placed", "blocks placed");
const placeScoreboardAll = world.scoreboard.getObjective("esploratori:blocks_placed_all") ?? world.scoreboard.addObjective("esploratori:blocks_placed_all", "blocks placed (overall)");

bridge.bedrockCommands.registerCommand("minestats", (p) => {
    p.sendMessage(`Mine stats:\n- Mined blocks (all times): ${breakScoreboardAll.getScore(p)} (${breakScoreboard.getScore(p)})\n\n- Placed blocks (all times): ${placeScoreboardAll.getScore(p)} (${placeScoreboard.getScore(p)})\n`)
}, "returns number of placed and mined blocks")

world.afterEvents.playerBreakBlock.subscribe(e=>{
    breakScoreboard.addScore(e.player, 1)
    breakScoreboardAll.addScore(e.player, 1)
})

world.afterEvents.playerPlaceBlock.subscribe(e => {
    placeScoreboard.addScore(e.player, 1)
    placeScoreboardAll.addScore(e.player, 1)
})

world.afterEvents.playerSpawn.subscribe(e=>{
    if (!e.initialSpawn) return;
    if (!breakScoreboardAll.hasParticipant(e.player)){        
        breakScoreboardAll.setScore(e.player, 0)
        placeScoreboardAll.setScore(e.player, 0)
    }  
    breakScoreboard.setScore(e.player, 0)  //session stats
    placeScoreboard.setScore(e.player, 0)
})