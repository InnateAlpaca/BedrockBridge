# WorldBridge Class

A class that contains all useful tools for BedrockBridge

## Properties

### **discordCommands**
`read-only discordCommands: bridgeCommands;`

Handler for commands that can be run from discord with /command. By default any command can be run, here you can handle whitelist or blacklist for them.

Type: [*bridgeCommands*](bridgeCommands.md)

### **events**
`read-only events: bridgeEvents;`

Contains a set of events that change BedrockBridge's behaviour.

Type: [*bridgeEvents*](bridgeEvents.md)

### **bedrockCommands**
`read-only bedrockCommands: bedrockCommands;`

Command handler for bedrockbridge.

Type: [*bedrockCommands*](bedrockCommands.md)

### **playerList**
`read-only bedrockCommands: Array<{name:string, id:string}>`

Full list of all players who joined the server:

Type: *Array<{name:string, id:string}>*

