/**
 * External
 * This plugin enables bridgeDirect capabilities for other packs.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

import { bridge } from "../addons";

bridge.events.bridgeInitialize.subscribe(e=>{
    e.registerAddition("discord_direct"); //enabling direct messages
})