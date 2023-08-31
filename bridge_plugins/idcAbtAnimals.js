/**
 * I don't care about animals (idcAbtAnimals) - BedrockBridge plugin
 * 
 * This addon ignores all "petDie" logs, so that you won't reveice any on discord. 
 * Notice: one reason you may wanna use this plugin is because you get some unwanted logs like for trader's llamas. 
 * If that's the case consider modifying this plugins so to ignore *only* the logs you don't want.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

import { bridge } from '../addons';

bridge.events.petDieLog.subscribe(e=>{
    e.cancel=true;
})