/**
 * justJoins - BedrockBridge plugin
 * This plugin will remove all logs and messages but join and leave embeds
 */

import { bridge } from '../addons';

bridge.events.chatUpStream.subscribe(e=>{
    e.cancel=true
})

bridge.events.chatUpStream.subscribe(e => {
    e.cancel = true
})

bridge.events.petDieLog.subscribe(e => {
    e.cancel = true
})

bridge.events.playerDieLog.subscribe(e => {
    e.cancel = true
})