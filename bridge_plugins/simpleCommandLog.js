/**
 * SimpleCommandLog @version 1.0.0 - BedrockBridge plugin
 * 
 * This addon logs all commands run through the command form to discord. 
 * This way you can always be informed about what are your admins doing.
 * 
 * Note: all regular slash commands cannot be logged. As a consequence
 * you must make sure that your admins cannot run them, and will only use
 * the provided !command utility. The plugins will handle this bu de-opping
 * all users that you mark as "admins" (or any other tag you want).
 * 
 * How does it work? Admins will only be able to run commands through  a form,
 * that will be opened by running !command
 * Only commands you allow can be run from there, you can exclude commands from the settings here below.
 * When an admin will use this tool to run a command, a message will be sent to the discord main chat,
 * logging che content.
 * 
 * Knowing that running commands without autocompletion can be annoying we introduced a functionality 
 * so to more easily target players: the form will also provide a dropdown with all online players.
 * If you select a player and use a selector "@t" in the command text-box, such placeholder will be
 * replaced by the actual name of the target. This way you won't have problems with writing the worng name
 * of the player, and so.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

// ***************************   Settings   ***************************
//commands that cannot be run from the !command form
const forbiddenCommands = ["execute", "kill", "op"]

//tags that identifie the player who can use the !command command
const allowedCommandTags = ["admin"]

// this will remove Op level form players who have the allowed tags. This way they will be able to run commands only through !command
const deopTargets = true 

// ********************************************************************

import { system, Player, world } from "@minecraft/server"
import { bridge, bridgeDirect } from "../addons";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";

var ENABLED = true; //pack enabled, disbale to avoid cache overflow if not bridge is established

const cache = [];

bridge.events.bridgeInitialize.subscribe(e=>{
    e.registerAddition("discord_direct"); //enabling direct messages
})

bridgeDirect.events.directInitialize.subscribe(()=>{
    while (cache.length>0){
        bridgeDirect.sendMessage(cache.shift());
    }
})

system.runTimeout(()=>{
    if (!bridgeDirect.ready){
        console.error("(BedrockBridge) [simpleCommandLog] Failed to start directBridge. Commands are not being reported.")
        ENABLED=false;
        cache.splice(0, cache.length)
    }
}, 500)

const sleep = n=>new Promise(acc=>system.runTimeout(acc, n));

class CommandForm extends ModalFormData {
    constructor(){
        super()
        this.playerList = ["(none)"]
        this.playerList.push(...world.getAllPlayers().map(p=>p.name));
        const description = "\nTarget to be identified by '@t' in the command textbox:\n"
        this.title("Command Manager")
            .dropdown(description, this.playerList, 0)
            .textField("\nCommand to run:\n", "")
            .submitButton("Run")
    }
    /**@param {Player} player*/
    async show(player) {
        let res = await super.show(player);
        if (res.cancelationReason === FormCancelationReason.UserBusy) {
            player.sendMessage("§oPlease close the chat so to open the menu.")
        }
        while (res.cancelationReason === FormCancelationReason.UserBusy) {
            await sleep(10)
            res = await super.show(player);
        }
        if (res.canceled) return;
        try {
            let rawCommand = res.formValues[1]
            if (res.formValues[0]!==0){
                rawCommand = rawCommand.replace("@t", this.playerList[res.formValues[0]])
            }
            
            const [command, ...args] = rawCommand.trimStart().split(" ")
            if (forbiddenCommands.includes(command)) {
                player.sendMessage("§cYou are not allowed to run this command. This incident will be reported.")
                const message = `${player.name} tried to run *"${command}"*, but is missing permission.`
                if (bridgeDirect.ready) {
                    bridgeDirect.sendMessage(message, "CommandWatcher")
                }
                else {
                    cache.push(message);
                }
            }
            else {
                const message = `Command execution for *${player.name}*: "${rawCommand}"`
                if (bridgeDirect.ready) {
                    bridgeDirect.sendMessage(message, "CommandWatcher")
                }
                else {
                    cache.push(message);
                }
                player.runCommandAsync(command + " " + args.join(" ")).then(({ successCount }) => {
                    if (successCount === 0) {
                        player.sendMessage("§cNo target match the selector.")
                    }
                    else {
                        player.sendMessage('§7You ran "' + command + " " + args.join(" ")+'"')
                        player.sendMessage("§eCommand succesfully executed.")
                    }
                }, err => {
                    player.sendMessage("§c" + err)
                })
            }
        }
        catch (err) {
            player.sendMessage("§cAn error occurred while handling your command.")
        }
    }
}


bridge.bedrockCommands.registerTagCommand("command", (player)=>{
    if (ENABLED){
        const form = new CommandForm();
        form.show(player)
    }        
    else {
        player.sendMessage("§cThis functionality is not currently active. If the error persists please get in touch with assistance.")
    }
}, "run a command", ...allowedCommandTags)

if (deopTargets)
    world.afterEvents.playerSpawn.subscribe(e=>{
        if (!e.initialSpawn) return
        if (e.player.isOp()&&e.player.getTags().find(t=>allowedCommandTags.includes(t))){
            e.player.setOp(false);
        }
    })