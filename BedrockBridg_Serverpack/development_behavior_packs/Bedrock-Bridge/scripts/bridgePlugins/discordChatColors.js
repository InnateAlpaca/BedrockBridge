/**
 * Discord Chat Colors (basicCustomCommands) v1.0.0 - BedrockBridge Plugin
 * 
 * This bridge-addon will show messages coming from discord with the same color as that of the highest role that the discord user has on the discord server.
 * e.g. discord user "Alpaca" has the top role "Admin" (red) on discord, then on game chat his discord messages will appear red.
 * 
 * Note: this addon is not compatible with basicNicerChat
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */


import { world } from "@minecraft/server";
import { bridge } from "../addons";

const namedColors = {
    black: { hex: "#000000", code: "§0" },
    dark_blue: { hex: "#0000aa", code: "§1" },
    dark_green: { hex: "#00aa00", code: "§2" },
    dark_aqua: { hex: "#00aaaa", code: "§3" },
    dark_red: { hex: "#aa0000", code: "§4" },
    dark_purple: { hex: "#aa00aa", code: "§5" },
    gold: { hex: "#ffaa00", code: "§6" },
    gray: { hex: "#aaaaaa", code: "§7" },
    dark_gray: { hex: "#555555", code: "§8" },
    blue: { hex: "#5555ff", code: "§9" },
    green: { hex: "#55ff55", code: "§a" },
    aqua: { hex: "#55ffff", code: "§b" },
    red: { hex: "#ff5555", code: "§c" },
    light_purple: { hex: "#ff55ff", code: "§d" },
    yellow: { hex: "#ffff55", code: "§e" },
    white: { hex: "#ffffff", code: "§f" },
    minecoin_gold: { hex: "#d8af00", code: "§g" }
};

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

function getClosestColor(hexColor) {
    const target = hexToRgb(hexColor);
    let closest = null;
    let minDist = Infinity;

    for (const [name, { hex, code }] of Object.entries(namedColors)) {
        const dist = colorDistance(target, hexToRgb(hex));
        if (dist < minDist) {
            minDist = dist;
            closest = { name, code, hex };
        }
    }

    return closest;
}

bridge.events.chatDownStream.subscribe(e => {
    if (e.color){
        const tag = getClosestColor(e.color).code
        e.message=tag+e.message
        e.cancel=true
        world.sendMessage(`<${e.author}> ${tag}${e.message.toBedrock()}`)
    }    
})
