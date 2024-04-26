/**
 * rolePlayerVerification - BedrockBridge Plugin @version 1.0.0
 * 
 * This bridge-addon requires player joining to undergo a simple verification process. 
 * They need to link their discord account rhtough !linkdc, and then send a message 
 * from discord chat such as !verify. The plugin will then verify if the roles are 
 * among the allowed ones, if not the player will be kicked.
 * 
 * WARNING: the verification is done only once, so if you remove the access role 
 * the player will still be able to join the server.
 * 
 * @author InnateAlpaca
 * {@link https://github.com/InnateAlpaca}
 */


import { bridge } from "../addons";
import { GameMode, world, system } from "@minecraft/server";

const settings = {
    limbo_tag: "limbo:locked",
    verified_tag: "limbo:verified",
    discord_verification_command: "!verify",
    allowed_role_ids: ["Admin"]
}

//-----------------------------------------------------------------------
//---------------------------------Code----------------------------------

function lock(player){
    player.runCommand("inputpermission set @s movement disabled");
    player.runCommand("inputpermission set @s camera disabled");
    player.setGameMode(GameMode.adventure);
    player.addTag(settings.limbo_tag);
}
function unlock(player){
    player.runCommand("inputpermission set @s movement enabled");
    player.runCommand("inputpermission set @s camera enabled");
    player.setGameMode(GameMode.survival);
    player.removeTag(settings.limbo_tag);
}

world.afterEvents.playerSpawn.subscribe(e=>{
    if (!e.initialSpawn) return;
    const player = e.player;

    if (!player.dcNametag || !player.hasTag(settings.verified_tag)){ //player is not linked
        player.sendMessage(`§pWelcome! In order to play on this server you need to link your account. Please run ${bridge.bedrockCommands.prefix}linkdc`+
        `\nOnce you received confirmation of succesfull link please head to discord chat and send the following message: §o${settings.discord_verification_command}`);
        lock(player);
    }
})

system.runInterval(()=>{
    for (const player of world.getPlayers({tags:[settings.limbo_tag]})){
        if (player.dcNametag && player.hasTag(settings.verified_tag)){
            unlock(player);
            player.sendMessage(`§pCongratulations! You may now play on the server!`);
        }
    }
}, 10)

bridge.events.bridgeInitialize.subscribe(e=>{
    e.registerAddition("discord_roles");
})

bridge.events.chatDownStream.subscribe(e=>{
    if (e.message===settings.discord_verification_command){
        e.cancel=true;
        const player = world.getAllPlayers().find(p=>p.dcNametag===e.author);
        if (player){
            for (const role of e.roles){
                if (settings.allowed_role_ids.includes(role)){
                    return player.addTag(settings.verified_tag);
                }
            }
            player.runCommand(`kick ${player.name} You don't have the allowed roles.`)
        }
    }
})