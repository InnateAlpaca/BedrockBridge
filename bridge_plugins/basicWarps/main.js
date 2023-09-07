/**
 * Basic Warps - BedrockBridge addon
 * 
 * This bridge-addon provides BedrockBridge with simple warp functionalities. We add two commands: !spawn
 * to teleport to player spawn or !warp <location name> to teleport to some other location.
 * You can customise the other locations form the file warps.js inside this very folder
 * 
 * Installation: copy the folder inside bridgePlugins, and add the following line to bridgePlugins/index.js 
 * import "./basicWarps/main"
 * be careful with renaming the folder.
 * 
 * ideated by PoWeROffAPT
 * coded by InnateAlpaca (https://github.com/InnateAlpaca)
 */

import { bridge } from '../../addons';
import { system, world, MinecraftDimensionTypes, Vector } from '@minecraft/server';
import { warps } from './warps';
import { options } from './options';

const player_cooldown = new Map() // for warp command in general

const dimensions = {}
for (const dim in MinecraftDimensionTypes){
    dimensions[dim] = world.getDimension(MinecraftDimensionTypes[dim]);
}

bridge.bedrockCommands.registerCommand("spawn", async (user)=>{   
    if (player_cooldown.has(user.id)){
        if (Date.now()-player_cooldown.get(user.id)<options.cooldown*1000){
            user.sendMessage("§cYou cannot run this command now. Command in cooldown..."); return;
        }
        else {
            player_cooldown.set(user.id, Date.now());
        }
    } 
    else {
        player_cooldown.set(user.id, Date.now());
    }
    const message = await new Promise(acc=>{
        system.run(()=>{
            if (user.getSpawnPoint()){
                const {dimension, ...user_location} = user.getSpawnPoint();
                user.teleport(user_location, {"dimension": dimension});
                acc("§eYou have been teleported to your spawn point.");
            }
            else {
                const {x, z} = world.getDefaultSpawnLocation()
                const location = dimensions.overworld.getBlockFromRay(new Vector(x, 400, z), Vector.down, {maxDistance: 500})?.block.location;
                if (location){
                    user.teleport(location, {"dimension": dimensions.overworld});
                    acc("§eYou have been teleported to your spawn point.");
                }
                else {
                    acc("§cTeleport to spawnpoint wasn't possible. Try again later.");
                }
            }
        })    
    })
    user.sendMessage(message);

}, "teleport the user to their spawn or, if the player doesn't have, to world spawn.")

bridge.bedrockCommands.registerCommand("listWarp", (user)=>{
    user.sendMessage("Available warp locations:\n- "+Object.keys(warps).join("\n- "))
}, "lists available warps.");

bridge.bedrockCommands.registerCommand("warp", (user, warp_name)=>{
    if (player_cooldown.has(user.id)){
        if (Date.now()-player_cooldown.get(user.id)<options.cooldown*1000){
            user.sendMessage("§cYou cannot run this command now. Command in cooldown..."); return;
        }
        else {
            player_cooldown.set(user.id, Date.now());
        }
    } 
    else {
        player_cooldown.set(user.id, Date.now());
    }
    if (warp_name in warps){
        system.run(()=>{
            const [x, y, z, dimensionId] = warps[warp_name];
            user.teleport(new Vector(x, y, z), {dimension: dimensions[dimensionId]});
        })
        user.sendMessage(`§eYou have been teleported to "${warp_name}".`);
    }
    else{
        user.sendMessage("§cUnknown warp name, please check available warps running §olistWarp");
    }
    
}, "teleport user to the selected warp area. Usage: warp <warp_name>")