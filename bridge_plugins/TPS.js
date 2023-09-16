/**
 * TPS (Ticks Per Second) v1.0.0 - BedrockBridge Plugin
 * 
 * This bridge-addon adds a useful command to check TPS.
 * 
 * Installations: in order to insall this plugin paste this file 
 * into `Bedrock-Bridge/scripts/bridgePlugins` and add 
 * the line `import "./TPS"` to `index.js`.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * ideated by Jaso0on
 */

import { system, world, DisplaySlotId } from '@minecraft/server';
import { bridge } from '../addons';

const tags = {
    admin: "admin"
}
const interval = 20;

const TPSscoreboard = world.scoreboard.getObjective("esploratori:serverstats")??world.scoreboard.addObjective("esploratori:serverstats", "Server Statistics");

TPSscoreboard.setScore("TPS", 20);

bridge.bedrockCommands.registerCommand("tps", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    user.sendMessage(`Current TPS is: ${tps.toFixed(2)}`)
}, "get current TPS for the server."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerCommand("showServerStats", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }
    system.run(()=>{
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {objective:TPSscoreboard});
        user.sendMessage("§eServer added to sidebar.")
    })
}, "show real-time TPS on players' screen sidebar."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerCommand("hideServerStats", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }
    system.run(()=>{
        world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
        user.sendMessage("§eServer stats removed from sidebar.")
    })   
}, "hide TPS stats from players' screen."); //this is the description which will be visualised in !help

var tps = 20;
var last_check = Date.now();

system.runInterval(()=>{
    tps = 1000*interval/(Date.now()-last_check);
    last_check = Date.now();
    TPSscoreboard.setScore("TPS", tps);
}, interval)