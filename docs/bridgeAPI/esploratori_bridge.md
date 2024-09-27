---
# DO NOT TOUCH — This file was automatically generated. See https://github.com/mojang/minecraftapidocsgenerator to modify descriptions, examples, etc.
author: InnateAlpaca
ms.prod: gaming
title: esploratori/bridgeAPI Module
description: Contents of the esploratori/bridgeAPI module
---
# esploratori/bridgeAPI Module

The `esploratori/bridgeAPI` module contains resources for customising and enhance BedrockBridge's capabilities.

## Available Versions
- `1.0.0`

## Classes
- [WorldBridge](WorldBridge.md)
- [bedrockCommands](bedrockCommands.md)
- [commandArgument](commandArgument.md)
- [bridgeCommands](bridgeCommands.md)
- [bridgeEvents](bridgeEvents.md)
- [EsploratoriDatabase](EsploratoriDatabase.md)
- [BridgeDirect](BridgeDirect.md)
- petDieLogEvent
- petDieLogEventSignal
- playerDieLogEvent
- playerDieLogEventSignal
- playerLeaveLogEvent
- playerLeaveLogEventSignal
- playerJoinLogEvent
- playerJoinLogEventSignal
- chatDownStreamEvent
- chatDownStreamEventSignal
- chatUpStreamEvent
- chatUpStreamEventSignal
- bridgeInitializeEvent
- bridgeInitializeEventSignal

## Objects
  
### **bridge**
`static read-only bridge: WorldBridge;`

Type: [*WorldBridge*](WorldBridge.md)

### **bridgeDirect**
`static read-only bridge: BridgeDirect;`

Type: [*BridgeDirect*](BridgeDirect.md)

### **database**
`static read-only bridge: EsploratoriDatabase;`

Type: [*EsploratoriDatabase*](EsploratoriDatabase.md)

## Extensions
Some native js types have been extended, here's a list of the changes.
### String
- toBedrock()
- toDiscord()
### Player
- mute()
- unmute()
- muted
- deaf
- dcNametag
### Array
- includesAll()
