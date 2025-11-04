/**
 * BedrockBridge Plugin Manager
 * @version 1.4.0
 * 
 * from @author Poweroff
 * UI-based plugin management system for BedrockBridge
 * Fixes: Command registration, plugin activation status, and improved UI
 */

import { bridge, database } from "./addons";
import { system} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData, FormCancelationReason } from "@minecraft/server-ui";

// Create and initialize database for plugin management
const pluginsDB = database.makeTable("pluginManager");
if (!pluginsDB.has("plugins")) { 
    
    // Default plugins from index.js
    pluginsDB.set("plugins", [
        { path: "./bridgePlugins/basicNicerChat", enabled: true },
        { path: "./bridgePlugins/basicCustomCommands", enabled: true },
        { path: "./bridgePlugins/deathCounter", enabled: true },
        { path: "./bridgePlugins/stepCounter", enabled: true },
        { path: "./bridgePlugins/playtime", enabled: true },
        { path: "./bridgePlugins/gameModes", enabled: true },
        { path: "./bridgePlugins/TPS", enabled: true },
        { path: "./bridgePlugins/simpleCommandLog", enabled: false },
        { path: "./bridgePlugins/getAwayWithMurder", enabled: false },
        { path: "./bridgePlugins/idcAbtAnimals", enabled: false },
        { path: "./bridgePlugins/customCommandCompatibility", enabled: false },
        { path: "./bridgePlugins/basicWarps/main", enabled: false },
        { path: "./bridgePlugins/chatRank/main", enabled: false },
        { path: "./bridgePlugins/blockStats", enabled: false }
    ]);
}

// Map to track loaded plugins
const loadedPlugins = new Map();

// Get the current plugin list from database
function getPlugins() {
    return pluginsDB.has("plugins") ? pluginsDB.get("plugins") : [];
}

// Extract plugin name from path
function getPluginName(path) {
    // Remove leading "./" if present
    const cleanPath = path.startsWith("./") ? path.substring(2) : path;
    
    // Handle paths with directories
    if (cleanPath.includes("/")) {
        const parts = cleanPath.split("/");
        // If ends with "main", use the directory name
        return parts[parts.length - 1] === "main" ? parts[parts.length - 2] : parts[parts.length - 1];
    }
    
    return cleanPath;
}

// Import a plugin with error handling
async function importPlugin(pluginPath) {
    try {
        // Ensure path is relative to the script location
        const normPath = pluginPath.startsWith("./") ? pluginPath : "./" + pluginPath;
        const plugin = await import(normPath);
        loadedPlugins.set(pluginPath, plugin);
        console.log(`Successfully loaded plugin: ${pluginPath}`);
        return { success: true };
    } catch (error) {
        console.error(`Failed to load plugin ${pluginPath}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Load enabled plugins that aren't already loaded
async function refreshPlugins() {
    const plugins = getPlugins();
    const results = [];
    
    for (const plugin of plugins) {
        if (plugin.enabled && !loadedPlugins.has(plugin.path)) {
            const result = await importPlugin(plugin.path);
            results.push({
                path: plugin.path,
                success: result.success,
                error: result.error
            });
        }
    }
    
    return results;
}

// Initial plugin loading on server start
system.runTimeout(async () => {
    console.log("BedrockBridge Plugin Manager: Loading enabled plugins...");
    const results = await refreshPlugins();
    
    let successCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
        if (result.success) {
            successCount++;
        } else {
            failCount++;
            console.warn(`Failed to load plugin ${result.path}: ${result.error}`);
        }
    });
    
    console.log(`BedrockBridge Plugin Manager: Loaded ${successCount} plugins. Failed: ${failCount}`);
}, 20);

// ==================== UI FUNCTIONS ====================

// Show main plugin manager UI
async function showPluginManagerUI(player) {
    const plugins = getPlugins();
    
    const mainMenu = new ActionFormData()
        .title("Plugin Manager")
        .body("Manage your BedrockBridge plugins")
        .button("Plugin List", "textures/ui/permissions_member_star")
        .button("Add New Plugin", "textures/ui/plus")
        .button("Reload Plugins", "textures/ui/refresh_light");
    let response = await mainMenu.show(player);
    while (response.canceled && response.cancelationReason===FormCancelationReason.UserBusy){
        await system.waitTicks(10);
        response = await mainMenu.show(player);
    }
   
    if (response.canceled) return;
    
    switch (response.selection) {
        case 0: // Plugin List
            system.runTimeout(() => showPluginListUI(player), 5);
            break;
        case 1: // Add New Plugin
            system.runTimeout(() => showAddPluginUI(player), 5);
            break;
        case 2: // Reload Plugins
            reloadPlugins(player);
            break;
    }
    
}

// Show list of all plugins
async function showPluginListUI(player) {
    const plugins = getPlugins();
    
    const pluginListForm = new ActionFormData()
        .title("Plugin List")
        .body("Select a plugin to manage");
    
    plugins.forEach(plugin => {
        const pluginName = getPluginName(plugin.path);
        const status = plugin.enabled ? "§a[ENABLED]" : "§c[DISABLED]";
        pluginListForm.button(`${pluginName}\n${status}`, 
            plugin.enabled ? "textures/ui/toggle_on" : "textures/ui/toggle_off");
    });
    
    pluginListForm.button("Back", "textures/ui/arrow_left");
    
    let response = await pluginListForm.show(player);
    while (response.canceled && response.cancelationReason===FormCancelationReason.UserBusy){
        await system.waitTicks(10);
        response = await pluginListForm.show(player);
    }
    
    if (response.canceled) return;
    
    if (response.selection === plugins.length) {
        // Back button
        system.runTimeout(() => showPluginManagerUI(player), 5);
        return;
    }
    
    // Show plugin details
    const selectedPlugin = plugins[response.selection];
    system.runTimeout(() => showPluginDetailsUI(player, selectedPlugin), 5);
    
}

// Show details and management options for a specific plugin
async function showPluginDetailsUI(player, plugin) {
    const pluginName = getPluginName(plugin.path);
    
    const pluginDetailForm = new ActionFormData()
        .title(`Plugin: ${pluginName}`)
        .body(`Path: ${plugin.path}\nStatus: ${plugin.enabled ? "Enabled" : "Disabled"}`)
        .button(plugin.enabled ? "Disable" : "Enable", 
            plugin.enabled ? "textures/ui/toggle_off" : "textures/ui/toggle_on")
        .button("Edit", "textures/ui/pencil_edit_icon")
        .button("Remove", "textures/ui/trash")
        .button("Back to List", "textures/ui/arrow_left");
    
    pluginDetailForm.show(player).then(response => {
        if (response.canceled) return;
        
        const plugins = getPlugins();
        const pluginIndex = plugins.findIndex(p => p.path === plugin.path);
        
        switch (response.selection) {
            case 0: // Toggle Enable/Disable
                system.runTimeout(() => togglePluginState(player, plugins, pluginIndex, plugin), 5);
                break;
            
            case 1: // Edit Plugin Path
                system.runTimeout(() => showEditPluginUI(player, plugin), 5);
                break;
                
            case 2: // Remove Plugin
                system.runTimeout(() => confirmPluginRemoval(player, plugins, pluginIndex, plugin), 5);
                break;
            
            case 3: // Back to List
                system.runTimeout(() => showPluginListUI(player), 5);
                break;
        }
    });
}

// Show edit plugin UI
async function showEditPluginUI(player, plugin) {
    const editPluginForm = new ModalFormData()
        .title(`Edit Plugin: ${getPluginName(plugin.path)}`)
        .textField("Plugin Path", "e.g. ./myPlugin", { defaultValue: plugin.path });
    
    editPluginForm.show(player).then(response => {
        if (response.canceled) {
            system.runTimeout(() => showPluginDetailsUI(player, plugin), 5);
            return;
        }
        
        const newPath = response.formValues[0];
        
        if (!newPath) {
            player.sendMessage("§cPlugin path cannot be empty!");
            system.runTimeout(() => showEditPluginUI(player, plugin), 20);
            return;
        }
        
        const plugins = getPlugins();
        
        // Check if new path already exists (but not the current plugin)
        if (plugins.some(p => p.path === newPath && p.path !== plugin.path)) {
            player.sendMessage(`§cPlugin '${newPath}' already exists!`);
            system.runTimeout(() => showEditPluginUI(player, plugin), 20);
            return;
        }
        
        // Update plugin path
        const pluginIndex = plugins.findIndex(p => p.path === plugin.path);
        const wasEnabled = plugins[pluginIndex].enabled;
        
        // If the plugin was loaded, remove it from loaded plugins
        if (loadedPlugins.has(plugin.path)) {
            loadedPlugins.delete(plugin.path);
        }
        
        // Update path
        plugins[pluginIndex].path = newPath;
        pluginsDB.set("plugins", plugins);
        
        player.sendMessage(`§aPlugin path updated to '${newPath}'.`);
        
        // Reload the plugin if it was enabled
        if (wasEnabled) {
            plugins[pluginIndex].enabled = true;
            importPlugin(newPath).then(result => {
                if (result.success) {
                    player.sendMessage(`§aPlugin '${newPath}' reloaded successfully!`);
                } else {
                    player.sendMessage(`§ePlugin '${newPath}' failed to load: ${result.error}`);
                }
                
                system.runTimeout(() => showPluginDetailsUI(player, plugins[pluginIndex]), 5);
            });
        } else {
            system.runTimeout(() => showPluginDetailsUI(player, plugins[pluginIndex]), 5);
        }
    });
}

// Toggle plugin enabled state
async function togglePluginState(player, plugins, pluginIndex, plugin) {
    plugins[pluginIndex].enabled = !plugin.enabled;
    pluginsDB.set("plugins", plugins);
    
    if (plugins[pluginIndex].enabled) {
        // Try to enable the plugin
        const result = await importPlugin(plugin.path);
        if (result.success) {
            player.sendMessage(`§aPlugin '${getPluginName(plugin.path)}' enabled successfully!`);
        } else {
            player.sendMessage(`§ePlugin '${getPluginName(plugin.path)}' marked as enabled but failed to load: ${result.error}`);
        }
    } else {
        player.sendMessage(`§aPlugin '${getPluginName(plugin.path)}' disabled. Note: Already loaded code will remain in memory until server restart.`);
    }
    
    // Return to plugin details with updated info
    system.runTimeout(() => showPluginDetailsUI(player, plugins[pluginIndex]), 5);
}

// Show confirmation before removing a plugin
async function confirmPluginRemoval(player, plugins, pluginIndex, plugin) {
    const confirmForm = new MessageFormData()
        .title("Confirm Removal")
        .body(`Are you sure you want to remove the plugin '${getPluginName(plugin.path)}'?`)
        .button1("Yes, Remove")
        .button2("Cancel");
    
    confirmForm.show(player).then(response => {
        if (response.canceled) {
            system.runTimeout(() => showPluginDetailsUI(player, plugin), 5);
            return;
        }
        
        if (response.selection === 0) { // Yes, Remove
            plugins.splice(pluginIndex, 1);
            pluginsDB.set("plugins", plugins);
            player.sendMessage(`§aPlugin '${getPluginName(plugin.path)}' removed from plugin manager.`);
            system.runTimeout(() => showPluginListUI(player), 5);
        } else {
            system.runTimeout(() => showPluginDetailsUI(player, plugin), 5);
        }
    });
}

// Show UI to add a new plugin
async function showAddPluginUI(player) {
    const addPluginForm = new ModalFormData()
        .title("Add New Plugin")
        .textField("Plugin Path", "e.g. ./bridgePlugins/myPlugin", { defaultValue: "./bridgePlugins/"});
    
    addPluginForm.show(player).then(response => {
        if (response.canceled) {
            system.runTimeout(() => showPluginManagerUI(player), 5);
            return;
        }
        
        const pluginPath = response.formValues[0];
        
        if (!pluginPath) {
            player.sendMessage("§cPlugin path cannot be empty!");
            system.runTimeout(() => showAddPluginUI(player), 20);
            return;
        }
        
        const plugins = getPlugins();
        
        // Check if plugin already exists
        if (plugins.some(p => p.path === pluginPath)) {
            player.sendMessage(`§cPlugin '${pluginPath}' already exists!`);
            system.runTimeout(() => showAddPluginUI(player), 20);
            return;
        }
        
        // Add new plugin
        plugins.push({ path: pluginPath, enabled: false });
        pluginsDB.set("plugins", plugins);
        player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' added to plugin manager.`);
        
        system.runTimeout(() => askEnableNewPlugin(player, pluginPath), 5);
    });
}

// Ask if the new plugin should be enabled right away
async function askEnableNewPlugin(player, pluginPath) {
    const enableNowForm = new MessageFormData()
        .title("Enable Plugin")
        .body(`Do you want to enable '${getPluginName(pluginPath)}' now?`)
        .button1("Yes, Enable")
        .button2("No, Later");
    
    let response = await enableNowForm.show(player);
    while(response.canceled && response.cancelationReason===FormCancelationReason.UserBusy){
        await system.waitTicks(10);
        response = await enableNowForm.show(player);
    }

    if (response.canceled) {
        system.runTimeout(() => showPluginListUI(player), 5);
        return;
    }
    
    if (response.selection === 0) { // Yes, Enable
        const plugins = getPlugins();
        const pluginIndex = plugins.findIndex(p => p.path === pluginPath);
        
        plugins[pluginIndex].enabled = true;
        pluginsDB.set("plugins", plugins);
        
        const result = await importPlugin(pluginPath);
        if (result.success) {
            player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' enabled successfully!`);
        } else {
            player.sendMessage(`§ePlugin '${getPluginName(pluginPath)}' marked as enabled but failed to load: ${result.error}`);
        }
    }
    
    system.runTimeout(() => showPluginListUI(player), 5);
    
}

// Reload all enabled plugins
async function reloadPlugins(player) {
    player.sendMessage("§6Reloading plugins...");
    
    // Clear loaded plugins to force reload
    loadedPlugins.clear();
    
    const results = await refreshPlugins();
    
    let successCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
        if (result.success) {
            successCount++;
        } else {
            failCount++;
            player.sendMessage(`§c${result.path}: ${result.error}`);
        }
    });
    
    player.sendMessage(`§aReloaded ${successCount} plugins. §c${failCount} failed.`);
    
    // Return to main menu after reload
    system.runTimeout(() => showPluginManagerUI(player), 60);
}

// ==================== COMMAND REGISTRATION ====================

// Register the plugin command for admin usage
const pluginCommand = bridge.bedrockCommands.registerAdminCommand("plugin", (player, arg1, arg2) => {
    // Use proper CommandArgument handling
    const action = arg1 ? arg1.toString().toLowerCase() : null;
    const pluginPath = arg2 ? arg2.toString() : null;
    
    // If no arguments, show UI
    if (!action) {
        system.runTimeout(() => showPluginManagerUI(player), 5);
        return;
    }
    
    // Process the command
    switch(action) {
        case "list":
            listPlugins(player);
            break;
            
        case "enable":
            enablePlugin(player, pluginPath);
            break;
            
        case "disable":
            disablePlugin(player, pluginPath);
            break;
            
        case "add":
            addPlugin(player, pluginPath);
            break;
            
        case "remove":
            removePlugin(player, pluginPath);
            break;
            
        case "ui":
            system.runTimeout(() => showPluginManagerUI(player), 5);
            break;
            
        case "reload":
            reloadPluginsCommand(player);
            break;
            
        default:
            player.sendMessage("§cInvalid command! Use !plugin ui|list|enable|disable|add|remove|reload");
    }
}, "Manage BedrockBridge plugins");

// List all available plugins
function listPlugins(player) {
    const plugins = getPlugins();
    player.sendMessage("§2=== Available Plugins ===");
    plugins.forEach(plugin => {
        const status = plugin.enabled ? "§a[ENABLED]" : "§c[DISABLED]";
        player.sendMessage(`${status} §f${getPluginName(plugin.path)} (${plugin.path})`);
    });
}

// Enable a specific plugin
async function enablePlugin(player, pluginPath) {
    if (!pluginPath) {
        player.sendMessage("§cSpecify a plugin path to enable!");
        return;
    }
    
    const plugins = getPlugins();
    const plugin = plugins.find(p => p.path === pluginPath);
    
    if (!plugin) {
        player.sendMessage(`§cPlugin '${pluginPath}' not found!`);
        return;
    }
    
    plugin.enabled = true;
    pluginsDB.set("plugins", plugins);
    
    const result = await importPlugin(pluginPath);
    if (result.success) {
        player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' enabled successfully!`);
    } else {
        player.sendMessage(`§ePlugin '${getPluginName(pluginPath)}' marked as enabled but failed to load: ${result.error}`);
    }
}

// Disable a specific plugin
function disablePlugin(player, pluginPath) {
    if (!pluginPath) {
        player.sendMessage("§cSpecify a plugin path to disable!");
        return;
    }
    
    const plugins = getPlugins();
    const plugin = plugins.find(p => p.path === pluginPath);
    
    if (!plugin) {
        player.sendMessage(`§cPlugin '${pluginPath}' not found!`);
        return;
    }
    
    plugin.enabled = false;
    pluginsDB.set("plugins", plugins);
    player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' disabled. Note: Already loaded code will remain in memory until server restart.`);
}

// Add a new plugin
function addPlugin(player, pluginPath) {
    if (!pluginPath) {
        player.sendMessage("§cSpecify a plugin path to add!");
        return;
    }
    
    const plugins = getPlugins();
    
    if (plugins.some(p => p.path === pluginPath)) {
        player.sendMessage(`§cPlugin '${pluginPath}' already exists!`);
        return;
    }
    
    plugins.push({ path: pluginPath, enabled: false });
    pluginsDB.set("plugins", plugins);
    player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' added to plugin manager. Use '!plugin enable ${pluginPath}' to enable it.`);
}

// Remove a plugin
function removePlugin(player, pluginPath) {
    if (!pluginPath) {
        player.sendMessage("§cSpecify a plugin path to remove!");
        return;
    }
    
    const plugins = getPlugins();
    const pluginIndex = plugins.findIndex(p => p.path === pluginPath);
    
    if (pluginIndex === -1) {
        player.sendMessage(`§cPlugin '${pluginPath}' not found!`);
        return;
    }
    
    plugins.splice(pluginIndex, 1);
    pluginsDB.set("plugins", plugins);
    player.sendMessage(`§aPlugin '${getPluginName(pluginPath)}' removed from plugin manager.`);
}

// Reload all enabled plugins (command version)
async function reloadPluginsCommand(player) {
    player.sendMessage("§6Reloading plugins...");
    
    // Clear loaded plugins to force reload
    loadedPlugins.clear();
    
    const results = await refreshPlugins();
    
    let successCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
        if (result.success) {
            successCount++;
        } else {
            failCount++;
            player.sendMessage(`§c${result.path}: ${result.error}`);
        }
    });
    
    player.sendMessage(`§aReloaded ${successCount} plugins. §c${failCount} failed.`);
}

// ==================== ITEM TRIGGER SUPPORT ====================

// // Open plugin manager UI when using a special item
// world.afterEvents.itemUse.subscribe(ev => {
//     // Using ender eye as the plugin manager item
//     if (ev.itemStack.typeId === "minecraft:ender_eye" && ev.source.hasTag("admin")) {
//         system.runTimeout(() => showPluginManagerUI(ev.source), 5);
//     }
// });


bridge.bedrockCommands.registerAdminCommand("resetPluginManagment", (player) => {
    pluginsDB.clear();
    player.sendMessage("All plugin records have been deleted. Please run reload in order to initialize again then default plugins")
}, "Reset plugin management");

import { gameCommandManager } from "./GameCommandManager";

gameCommandManager.setCallback("plugins", (origin)=>{
    system.run(()=>{
        showPluginManagerUI(origin.sourceEntity)
    })
    
})

console.log("BedrockBridge Plugin Manager initialized successfully.");