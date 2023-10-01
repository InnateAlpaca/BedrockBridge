# bedrockCommands Class

A class that provides command register system for BedrockBridge plugins.

## Properties

### **prefix**
`read-only prefix: string;`

Command prefix as setup in bedrockbridge settings.

Type: string


## Methods
- [registerCommand](#registerCommand)

### **registerCommand**
`
registerCommand(name, callback, description): void
`

Register a command that can be run with the standard bridge prefix.

#### **Parameters**
- **name**: *string*
- **callback**: *(player: Player, ...params: commandArgument[])=>void* callback called on command run.
- **description**: *string* add a description that will be shown when players run "help" command.

### **registerAdminCommand**
`
registerAdminCommand(name, callback, description): void
`

Register a command that can be run with the standard bridge prefix by players having the default admin tag `esploratori:admin`.

#### **Parameters**
- **name**: *string*
- **callback**: *(player: Player, ...params: commandArgument[])=>void* callback called on command run.
- **description**: *string* add a description that will be shown when players run "help" command.

### **registerTagCommand**
`
registerAdminCommand(name, callback, description, ...tags): void
`

Register a command that can be run with the standard bridge prefix by players having the specified tag or tags.

#### **Parameters**
- **name**: *string*
- **callback**: *(player: Player, ...params: commandArgument[])=>void* callback called on command run.
- **description**: *string* add a description that will be shown when players run "help" command.
- **tags**: *string[]* list of tags which will allow players to run this command.
