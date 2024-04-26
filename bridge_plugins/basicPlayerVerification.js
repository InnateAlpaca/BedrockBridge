/**
 * basicPlayerVerification - BedrockBridge Plugin @version 1.0.0
 * 
 * This bridge-addon requires player joining to undergo a simple verification process. 
 * They need to link their discord account rhtough !linkdc. Once they did it players will
 * be able to play on the server. Otherwise thye will be "blocked" and in adventure mode.
 * 
 * @author InnateAlpaca
 * {@link https://github.com/InnateAlpaca}
 */

import { bridge } from "../addons";
import { GameMode, world, system } from "@minecraft/server";

const limbo_tag = "limbo:locked";

function lock(player){
    player.runCommand("inputpermission set @s movement disabled");
    player.runCommand("inputpermission set @s camera disabled");
    player.setGameMode(GameMode.adventure);
}
function unlock(player){
    player.runCommand("inputpermission set @s movement enabled");
    player.runCommand("inputpermission set @s camera enabled");
    player.setGameMode(GameMode.survival);
}

world.afterEvents.playerSpawn.subscribe(e=>{
    if (!e.initialSpawn) return;
    const player = e.player;
    if (!player.dcNametag){ //player is not linked
        player.sendMessage(`§pWelcome! In order to play on this server you need to link your account. Please run ${bridge.bedrockCommands.prefix}linkdc`);
        lock(player)
        player.addTag(limbo_tag);
    }
    else {
        console.log(`nametag ${player.dcNametag}`)
    }
})

system.runInterval(()=>{
    for (const player of world.getPlayers({tags:[limbo_tag]})){
        if (player.dcNametag){
            unlock(player);
            player.removeTag(limbo_tag);
            player.sendMessage(`§pCongratulations! You may now play on the server!`);
        }
    }
}, 20)