import {bridge} from '../addons'

/**
 * Get Away With Murder BedrockBridge addon
 * This Addons doesn't report to discord people with the tag "gawm" (Get Away With Murder)
 */

bridge.events.playerDieLog.subscribe((e, deadDude, damage)=>{
    if (damage.damagingEntity?.hasTag("gawm")){
        e.cancel=true;
    }
})
bridge.events.petDieLog.subscribe((e, deadPet, damage)=>{
    if (damage.damagingEntity?.hasTag("gawm")){
        e.cancel=true;
    }
})