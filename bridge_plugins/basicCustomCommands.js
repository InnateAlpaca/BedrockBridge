/**
 * Basic Custom Commands (basicCustomCommands)  - BedrockBridge Plugin
 * @version 1.0.6
 * This bridge-addon provides some useful ingame additional prefix-commands. This is mainly meant as an example for you to make more!
 * Once you register a command you will be able to visualise it from !help along with the other bridge commands
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * adapted by Fundam
 */

import { system, GameMode, world } from '@minecraft/server';
import { bridge } from '../addons';

const tags = {
    member: "member"
};

// You can see the structure: 1) name of command, 2) callback run when the command is used (and you get 
// the player who ran the command, and all parameters already split even with quotes) and 3) description
// which will be visualised when a player runs !help
bridge.bedrockCommands.registerAdminCommand("tp", (user, target) => {
    // Now let's do the stuff
    if (target?.readPlayer()) //readPlayer converts the string in a player object with that nametag
        user.teleport(target.readPlayer().location);
    else {
        user.sendMessage("§ctarget player not found");
    }
}, "teleport to the target player location. Usage: tp <username>"); //this is the description which will be visualised in !help


bridge.bedrockCommands.registerAdminCommand("mute", (user, target, time) => {
    const target_player = target?.readPlayer();
    if (target_player) {
        if (time) {
            target_player.mute();
            target_player.sendMessage("§oYou have been muted by an admin.");

            system.runTimeout(() => {
                target_player.unmute();
                target_player.sendMessage("§oYou have been unmuted.");
            }, time.readInteger())
        }
        else { //didn't say the time... so forever ig?
            target_player.mute();
            target_player.sendMessage("§oYou have been muted by an admin.");
        }
    }
    else { //he didn't say the nametag
        user.sendMessage("§ctarget player not found. Make sure to use a valid nametag when you run this command.");
    }
}, "mute a target player for a specified amount of time. Usage: tp <username> <time?>");


// Ideated by PoWeROffAPT
bridge.bedrockCommands.registerAdminCommand("heal", (user, target) => {
    const target_player = target?.readPlayer();
    if (target_player) {
        system.run(() => {
            target_player.getEffects().forEach(e => {
                // removing all effects from the player
                target_player.removeEffect(e.typeId);
            })
            target_player.getComponent("health").resetToMaxValue();
        })
        target_player.sendMessage("§aYou have been healed by an admin.");
    } else {
        user.sendMessage("§cTarget player not found. Make sure to use a valid username when you run this command.");
    }
}, "heal a target player. Usage: heal <username>");

// Ideated by PoWeROffAPT
bridge.bedrockCommands.registerAdminCommand("gamemode", async (user, target, mode) => {
    const target_player = target?.readPlayer();
    if (mode.toString() in GameMode && target_player) {
        await target_player.runCommandAsync(`gamemode ${mode} @s`);
        target_player.sendMessage(`§aYour gamemode has been changed to ${mode} by an admin.`);
        user.sendMessage("§eCommand succefully executed.");
    }
    else {
        user.sendMessage("§eMissing parameter. Usage: gamemode <username> <gamemode>");
    }
}, "set gamemode for a target player. Usage: gamemode <username> <gamemode> (e.g. §ogamemode dude12 survival)");

const die_score_names = { x: "esploratori:die_loc_x", y: "esploratori:die_loc_y", z: "esploratori:die_loc_z", d: "esploratori:die_dim" };
const die_loc_x = world.scoreboard.getObjective(die_score_names.x) ?? world.scoreboard.addObjective(die_score_names.x, "player death x");
const die_loc_y = world.scoreboard.getObjective(die_score_names.y) ?? world.scoreboard.addObjective(die_score_names.y, "player death y");
const die_loc_z = world.scoreboard.getObjective(die_score_names.z) ?? world.scoreboard.addObjective(die_score_names.z, "player death z");
const die_dim = world.scoreboard.getObjective(die_score_names.d) ?? world.scoreboard.addObjective(die_score_names.d, "player death dimension");

bridge.events.playerDieLog.subscribe((e, player) => {
    if (player.isValid) {
        die_loc_x.setScore(player, player.location.x);
        die_loc_y.setScore(player, player.location.y);
        die_loc_z.setScore(player, player.location.z);
        switch (player.dimension.id) {
            case "minecraft:overworld":
                die_dim.setScore(player, 0);
                break;
            case "minecraft:nether":
                die_dim.setScore(player, 1);
                break;
            case "minecraft:the_end":
                die_dim.setScore(player, 2);
                break;
        }
    }
})

const recovery_dims = [world.getDimension("minecraft:overworld"), world.getDimension("minecraft:nether"), world.getDimension("minecraft:the_end")];

bridge.bedrockCommands.registerTagCommand("recover", (player) => {
    if (player.scoreboardIdentity && die_loc_x.hasParticipant(player.scoreboardIdentity)) { //we check just one, no need for the whole 3 as they are set together
        system.run(() => {
            const recovery_dim = recovery_dims[die_dim.getScore(player.scoreboardIdentity)];
            player.teleport(
                { x: die_loc_x.getScore(player.scoreboardIdentity), y: die_loc_y.getScore(player.scoreboardIdentity), z: die_loc_z.getScore(player.scoreboardIdentity)},
                {
                    dimension: recovery_dim
                }
            );
            player.sendMessage("§eYou have been teleported to the last available death location.");
        })
    }
    else {
        player.sendMessage("§cTeleport was not possible: last death location is not available.");
    }
}, "teleport players to the last place where they died, if available.", "esploratori:admin", tags.member);

const dimensions = ["§aoverworld§r", "§bnether§r", "§eend§r"];

bridge.bedrockCommands.registerCommand("cover", (player) => {
    if (player.scoreboardIdentity && die_loc_x.hasParticipant(player.scoreboardIdentity)) { //we check just one, no need for the whole 3 as they are set together
        const deathx = die_loc_x.getScore(player.scoreboardIdentity);
        const deathy = die_loc_y.getScore(player.scoreboardIdentity);
        const deathz = die_loc_z.getScore(player.scoreboardIdentity);
        
        const deathdim = dimensions[die_dim.getScore(player.scoreboardIdentity)];
        player.sendMessage(`§l§4Last Death Co-ords : §r X: ${deathx} , Y: ${deathy} , Z: ${deathz} in the ${deathdim} .`);
    }
    else {
        player.sendMessage("§cLast death co-ords not available.");
    }
}, "Get your last death co-ords if available .");