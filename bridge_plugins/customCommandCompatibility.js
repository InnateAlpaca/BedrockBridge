import { bridge } from '../addons';
/**
 * Compatibility BedrockBridge addon
 * This addon will prevent messages with specific prefixes from being sent to discord. This is useful when you have another custom-command addon and you don't want command text being sent to discord chat.
 */

const ignore_prefixes = ["?"] 
// const ignore_prefixes = ["?", ".", "!"] // multiple prefixes are possible too. Feel free to edit it!

bridge.events.chatUpStream.subscribe(e=>{
    if (ignore_prefixes.includes(e.message.at(0))){
        e.cancel=true;
    }
})