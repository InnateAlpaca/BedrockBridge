/**
 * *****************************  addons.js  *****************************
 * @version 1.0.3
 * Developed by Esploratori-Development https://discord.gg/kR2YwxaHxg
 * This module provides additional scripting capabilities known as bridgeAPI
 * which you can use to modify and enhance BedrockBridge capabilities, and
 * overall bedrock experience in general. We don't only provide tools to handle
 * BedrockBridge, but also generally useful scripting tools, which you can use to 
 * achieve your goals while writing a bridge-plugin.
 * You are encouraged to share your bridge-plugins with Esploratori-Dev community, 
 * you can upload your work in
 * https://github.com/InnateAlpaca/BedrockBridge/tree/main/bridge_plugins
 * 
 * Full **documentation can** be found at 
 * https://github.com/InnateAlpaca/BedrockBridge/blob/main/docs/bridgeAPI/esploratori_bridge.md
 * and the following code also fully documents all enahncements available.
 * 
 * Uniquely use this tool for bridge-plugins. If you wish to include part of this code in
 * your own addons ask BedrockBridge developers https://bedrockbridge.esploratori.space/Contact.html.
 * 
 * Donations (starting at 5$) are welcome in https://gofund.me/eed4b8e5
 */

import * as mc from "@minecraft/server";
import { bridgeDirect } from "./BridgeDirect";

/**
 * @module bridge
 * @description This module provides BedrockBridge the tools you need to customise its behaviour and enhance its capabilities.
 * @author InnateAlpaca
 * 
 * @typedef bridgeInitializeEvent
 * @property {(name: "discord_roles"|"ender_chest_item_list"|"discord_direct", ...params)=>void} registerAddition subscribe to enhance bridge's capabilities.
 * @typedef bridgeInitializeEventSignal
 * @property {(callback:(arg: bridgeInitializeEvent)=>void)=>(arg: bridgeInitializeEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: bridgeInitializeEvent)=>void)=>void} unsubscribe remove the callback for this events.
 * 
 * @typedef chatUpStreamEvent
 * @property {string} author name that will be displayed on discord as author of the message
 * @property {string} message message that is being uploaded to discord
 * @property {string?} url profile picture url for this message.
 * @property {boolean} cancel if true the message won't be sent
 * @typedef chatUpStreamEventSignal
 * @property {(callback:(arg: chatUpStreamEvent, player: Player)=>void)=>(arg: chatUpStreamEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: chatUpStreamEvent)=>void)=>void} unsubscribe remove the callback for this events.
 * 
 * @typedef chatDownStreamEvent
 * @property {string} author discord-displayname of the author of the message
 * @property {string} message message from discord
 * @property {string[]?} roles name of roles that belong to the player. Only if "discord_roles" addition was enabled.
 * @property {string?} mention discord id of the user whose message is being replied
 * @property {string?} color color of the top role assigned to the discord user
 * @property {boolean} cancel if true the message won't be sent 
 * @typedef chatDownStreamEventSignal
 * @property {(callback:(arg: chatDownStreamEvent)=>void)=>(arg: chatDownStreamEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: chatDownStreamEvent)=>void)=>void} unsubscribe remove the callback for this events.
 * 
 * @typedef playerJoinLogEvent
 * @property {string} user username of the player logging in
 * @property {boolean} cancel if true the embed won't be sent 
 * @typedef playerJoinLogEventSignal
 * @property {(callback:(arg: playerJoinLogEvent, player: Player)=>void)=>(arg: playerJoinLogEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: playerJoinLogEvent)=>void)=>void} unsubscribe remove the callback for this events.
 * 
 * @typedef playerLeaveLogEvent
 * @property {string} user username of the player logging off
 * @property {boolean} cancel if true the embed won't be sent 
 * @typedef gonePlayerObject
 * @property {string} name username of the player
 * @property {string} id entityId of the player
 * @typedef playerLeaveLogEventSignal
 * @property {(callback:(arg: playerLeaveLogEvent, player: gonePlayerObject)=>void)=>(arg: playerLeaveLogEvent)=>void} subscribe register a new callback for this event. Warning: the player instance might be stale.
 * @property {(callback:(arg: playerLeaveLogEvent)=>void)=>void} unsubscribe remove the callback for this events.
 *
 * @typedef playerDieLogEvent
 * @property {string} message message displayed as the player dies. It can be re-edited
 * @property {boolean} cancel if true the embed won't be sent 
 * @typedef playerDieLogEventSignal
 * @property {(callback:(arg: playerDieLogEvent, player: Player, damageSource: mc.EntityDamageSource)=>void)=>(arg: playerDieLogEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: playerDieLogEvent)=>void)=>void} unsubscribe remove the callback for this events. 
 * 
 * @typedef petDieLogEvent
 * @property {string} message message displayed as a tamed entity dies. It can be re-edited
 * @property {boolean} cancel if true the embed won't be sent 
 * @typedef petDieLogEventSignal
 * @property {(callback:(arg: petDieLogEvent, pet: mc.Entity, damageSource: mc.EntityDamageSource)=>void)=>(arg: petDieLogEvent)=>void} subscribe register a new callback for this event.
 * @property {(callback:(arg: petDieLogEvent)=>void)=>void} unsubscribe remove the callback for this events. 
*/

class Player extends mc.Player {

    /**@type {string} discord nametag of the player, if profile is linked.*/
    dcNametag

    /**@type {boolean} returns if a player is muted.*/
    muted

    /**@type {boolean} returns if a player is deaf, won't visualise messages from discord.*/
    deaf

    /**mute a player from bedrock and discord chat.*/
    mute() { /** body of function */ }

    /**mute a player for bedrock and discord chat.*/
    unmute() { /** body of function */ }

}

export class BridgeEvents {
    /**
     * This event fires every time someone sends a message on mc chat, you can edit how it will appear on discord chat.
     * @type {bridgeInitializeEventSignal}
     */
    bridgeInitialize

    /**
     * This event fires every time someone sends a message on mc chat, you can edit how it will appear on discord chat.
     * @type {chatUpStreamEventSignal}
     */
    chatUpStream

    /**
     * This event fires every time someone sends a message on discord chat, you can edit how it will appear on bedrock chat.
     * @type {chatDownStreamEventSignal}
     */
    chatDownStream

    /**
     * This event fires every time a player joins the server.
     * @type {playerJoinLogEventSignal} 
     */
    playerJoinLog

    /**
     * This event fires every time a player leaves the server.
     * @type {playerLeaveLogEventSignal}
     */
    playerLeaveLog

    /**
     * This event fires when a player dies.
     * @type {playerDieLogEventSignal}
     */
    playerDieLog

    /**
     * This event fires when someone's pet dies.
     * @type {petDieLogEventSignal}
     */
    petDieLog
}

class BridgeCommands {
    /**
     * If command manager is set in allow mode (forbids all commands that are not listed) or forbid mode (allows all commands that are not listed)
     * @type {boolean}
     */
    allow_mode

    /**
     * Forbid execution of a specific command (or commands) from discord when running /command
     * @param {string} command_name name of the command to disallow
     * @param  {...string} other_commands list of other commands to disallow
     */
    forbid(command_name, ...other_commands) { /** body of function */ }

    /**
     * Allows execution ONLY of a specific command (or commands) from discord when running /command. All other commands will be disabled by default
     * @param {string} command_name name of the command to disallow
     * @param  {...string} other_commands list of other commands to disallow
     */
    allow(command_name, ...other_commands) { /** body of function */ }

    /**
     * Get a list of registered commands to allow/disallow for the server.
     */
    list
}

class BridgeNetwork {
    /**
     * Allow your players to transfer to a different server by using !transfer command.
     * @param {string} name name to identify this server, to be used in the !transfer command
     * @param {string} host target server domain e.g. "play.esploratori.space"
     * @param {string} port target server port, e.g. 19132
     * @param {string[]?} tags list of tags necessary to be able to run the transfer command
     */
    addPartnerServer(name, host, port, tags) { /* function body */ }

    /** 
     * Returns a list containing all partner registered servers.
     * @type {{name:string, host:string, port:string, tags:string[]}[]}
    */
    serverList
}

export class CommandArgument extends String {
    /**
     * Returns the command argument as floating number (converts the text if possible) @returns {Number} parameter
     */
    readNumber() { /* function body */ }

    /**
     * Returns the command argument as integer (converts the text if possible) @returns {Number} parameter
     */
    readInteger() { /* function body */ }

    /**
     * Returns the command argument as boolean (converts the text if possible) @returns {Boolean} parameter
     */
    readBoolean() { /* function body */ }

    /**
     * Returns a player object whose name is the current argument @returns {Player|undefined} parameter
     */
    readPlayer() { /* function body */ }

    /**
     * Returns a location. Notice: this only works if the paramter was passed as single paramter with quotes e.g. "12 32 54" @returns {mc.Vector} parameter
     */
    readLocation() { /* function body */ }
}

class BridgeCommand {
    /**
     * Prefix used by all chat commands for BedrockBridge. 
     * @readonly
     * @type {string}
     */
    prefix

    /**
     * Name of the command 
     * @readonly
     * @type {string}
     */
    name

    /**
     * Set a list of tags for the players who can run this command.
     * @param {string[]} tags 
     * @returns {BridgeCommand}
     */
    setTags(tags){ /** ... */ }

    /**
     * Set a description for this command
     * @param {string} description 
     * @returns {BridgeCommand}
     */
    setDescription(description) { /** ... */ }
}

class BedrockCommands {
    /**
     * Register a command that can be run with the standard bridge prefix.
     * @param {string} name
     * @param {(player: Player, ...params: CommandArgument[])=>void} callback callback called on command run.
     * @param {string?} description add a description that will be shown when players run "help" command.
     * @returns {BridgeCommand}
     */
    registerCommand(name, callback, description) { /** function body */ }

    /**
     * Register a command that can be run only by players with an "admin" tag.
     * @param {string} name
     * @param {(player: Player, ...params: CommandArgument[])=>void} callback callback called on command run.
     * @param {string?} description add a description that will be shown when players run "help" command.
     * @returns {BridgeCommand}
     */
    registerAdminCommand(name, callback, description) { /** function body */ }

    /**
     * Register a command that can be run only by players with a specific tag.
     * @param {string} name
     * @param {(player: Player, ...params: CommandArgument[])=>void} callback callback called on command run.
     * @param {string} description add a description that will be shown when players run "help" command.
     * @param {string[]} tags list of tags which will allow players to run this command.
     * @returns {BridgeCommand}
     */
    registerTagCommand(name, callback, description, ...tags) { /** function body */ }

    /**
     * Prefix for Bridge commands, as selected in bridge-settings.
     * @type {string} @readonly
     */
    prefix
}

export class WorldBridge {
    /**
     * Handle how and what commands can be run from discord
     * @type {BridgeCommands}
     */
    discordCommands

    /**
     * Bridge events. You can handle and modify events generated by bedrockbridge
     * @type {BridgeEvents}
     */
    events

    /**
     * Register new commands to run with the standard bridge prefix from bedrock chat. 
     * @type {BedrockCommands}
     */
    bedrockCommands

    /**
     * Returns the list of all players who joined the server with username and entityId.
     * @type {{name:string, id:string}[]}
     */
    playerList

    /**
     * Manage BedrockBridge network features 
     * @type {BridgeNetwork}
     */
    bridgeNetwork

}

export class EsploratoriDatabase {
    /**
     * Create a persistent table for the world. @throws if bad or duplicate name is provided.
     * @param { string } name 
     * @returns { Map<string, Any> } A persistent Map across game sessions
     */
    makeTable(name){ }
    /**Returns the name of the instances of all databases. @returns {string[]}*/
    get tableNames(){ }
}

const bridge = new WorldBridge(); mc.world.bridge = bridge;

const database = new EsploratoriDatabase();

export { bridge, bridgeDirect,  database };