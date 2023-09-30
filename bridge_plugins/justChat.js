/**
 * JustChat - BedrockBridge plugin
 * 
 * This addon will remove all event log embed such as: join, leave, die leaving only plain chat readable on discord.
 * If you awnt to remove them because they take too much space also consider switching output mode to "legacy" from options.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * idea by Relax
 */

import { bridge } from '../addons';

bridge.events.petDieLog.subscribe(e=>{
    e.cancel=true;
})

bridge.events.playerDieLog.subscribe(e=>{
    e.cancel=true;
})

bridge.events.playerJoinLog.subscribe(e=>{
    e.cancel=true;
})

bridge.events.playerLeaveLog.subscribe(e=>{
    e.cancel=true;
})