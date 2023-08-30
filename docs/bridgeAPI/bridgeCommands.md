# bridgeCommands Class

A class that provides system-level events and functions.

## Properties

### **allow_mode**
`read-only allow_mode: boolean;`

If command manager is set in allow mode (forbids all commands that are not listed) or forbid mode (allows all commands that are not listed)

Type: [*boolean*]

### **list**
`read-only list: string[];`

Get a list of registered commands to allow/disallow for the server

## Methods
- [allow](#allow)
- [forbid](#forbid)

### **allow**
`
allow(command_name: string, ...other_commands: string[]): void
`

Allows execution ONLY of a specific command (or commands) from discord when running /command. All other commands will be disabled by default

#### **Parameters**
- **command_name**: *string*
- **other_commands**: *string[]*

### **forbid**
`
forbid(command_name: string, ...other_commands: string[]): void
`

Forbid execution of a specific command (or commands) from discord when running /command

#### **Parameters**
- **command_name**: *string*
- **other_commands**: *string[]*