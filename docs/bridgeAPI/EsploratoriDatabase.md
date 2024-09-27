# BridgeDirect Class

A class that provides an easy to use persisten storage.


## Properties

### **tableNames**
`read-only ready: string[]`

List of the names of all the tables created with this utility. 

Type: string[]

> [!NOTE] Duplicate names are forbidden.

## Methods
- [makeTable](#makeTable)

### **makeTable**
`
makeTable(name): Map
`

Create a persistent Map. All values saved here will be memorized across game sessions and server restarts.

#### **Parameters**
- **name**: *string* name of the table.

## Example
First the bridge-plugin must enable to bridgeDirect capabilities

```js
import { world } from "@minecraft/server"
import { database } from "../addons";

const winners = database.makeTable("winners");

world.afterEvents.entityDie.subscribe(e=>{
    if (e.deadEntity.typeId==="minecraft:ender_dragon") 
        winners.set(e.damageSource.damagingEntity.id, e.damageSource.damagingEntity.name)
})
```