// BedrockBridge - Customise Module
// This module will allow you to customise a few features of this addon. Modifying these functions you can change how the messages from and to discord are displayed (both on minecraft and on discord).
//
// NOTE: This is the ONLY allowed modification of this addon. Any other changes to this addon's behaviour will result in a permanent ban from this service.
// Warning: not following functions signature might break the addon. If so just get back to the original module.

import { world, Player } from '@minecraft/server';

/**
 * @function downStreamMessage Here you can customise how messages sent from discord will appear in minecraft chat. This function will be run everytime a new message is received from your discord server.
 * @param {string} author nametag of the discord user who sent the message.
 * @param {string} message plain string containing the message sent from discord.
 * @param {string[]} roles list of numeric identifier of discord roles for the sender.
 */
const downStreamMessage = async (author, message, roles)=>{
    world.sendMessage(`§9<${author}> ${message}§r`);
    // world.sendMessage("", {with:"InnateALpaca102"})
}


/**
 * @function upStreamMessage Here you can customise how messages sent from minecraft will appear in discord chat. This function will be run everytime a player writes a message in minecraft-chat (unless it's muted or is using commands such as /w, /say...).
 * @param {Player|{nick:string}} player player object of the sernder.
 * @param {string} message plain string containing the message sent by the minecraft player.
 * @returns {{author:string, text:string}}
 */
const upStreamMessage = async (player, message)=>{
    return {
        author: player.nick,
        text: message
    }   
}


/**
 * List of players gametag: these players' death embeds won't be shown on discord.
 * @type {string[]}
 */
const ignore_death = [];

/**
 * List of players gametag: these players' log embeds (join/leave) won't be shown on discord.
 * @type {string[]}
 */
const ignore_log = [];

/**
 * List of players gametag: these players' chat won't be streamed to discord.
 * @type {string[]}
 */
const ignore_chat = [];

// Example:
// const ignore_death = ["TheGoodOwner123", "TheWeakDude19"]


// const item_translate = {}

export const customise = {
    downStreamMessage, upStreamMessage
}
export const ignores = {
    ignore_death, ignore_log, ignore_chat
}