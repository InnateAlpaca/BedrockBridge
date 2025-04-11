/**
 * Mob HeartDisplay Plugin - BedrockBridge Edition
 * Version: 6.0.0 - Enhanced Performance & Full English Support
 * Original Author: poweroffapt
 * Enhanced by: Claude
 */

import { system, world, EntityComponentTypes } from '@minecraft/server';
import { ModalFormData, ActionFormData } from '@minecraft/server-ui';
import { bridge, database } from '../addons';

// ======= DATABASE SETTINGS =======
const SETTINGS = database.makeTable('heartdisplay.settings');

// ======= GLOBAL CONFIGURATION =======
let HEART_SYMBOL = SETTINGS.get('symbol') ?? '❤';
let UPDATE_INTERVAL = SETTINGS.get('interval') ?? 20;
let DISPLAY_MODE = SETTINGS.get('mode') ?? 'below';
let ENABLED = SETTINGS.get('enabled') ?? true;
let DISPLAY_STYLE = SETTINGS.get('style') ?? 'symbol';
let COLOR_CODING = SETTINGS.get('color_coding') ?? true;

// ======= CONSTANTS AND TAGS =======
const DEBUG_TAG = 'heartdisplay:debug';
const HIDE_TAG = 'heartdisplay:hide';
const ADMIN_TAG = 'admin';
const DIMENSIONS = ['minecraft:overworld', 'minecraft:nether', 'minecraft:the_end'];

// ======= HEART DISPLAY FORMATTING =======
function formatHearts(health, maxHealth = 20) {
  const percent = (health / maxHealth) * 100;
  
  // Determine color based on health percentage
  let color = '§f'; // Default white
  if (COLOR_CODING) {
    if (percent <= 15) color = '§4'; // Dark red (critical)
    else if (percent <= 30) color = '§c'; // Red (low)
    else if (percent <= 60) color = '§6'; // Gold (medium)
    else if (percent <= 80) color = '§a'; // Green (good)
    else color = '§2'; // Dark green (full)
  }

  switch (DISPLAY_STYLE) {
    case 'percent':
      return `${color}${Math.round(percent)}%`;
    case 'bar': {
      const totalBars = 10;
      const filled = Math.round((health / maxHealth) * totalBars);
      return `${color}|${'█'.repeat(filled)}${'░'.repeat(totalBars - filled)}|`;
    }
    case 'numeric':
      return `${color}${health.toFixed(1)}/${maxHealth.toFixed(1)}`;
    case 'mixed': {
      const fullHearts = Math.floor(Math.max(0, health / 2));
      const hasHalf = (health % 2) >= 1;
      return `${color}${HEART_SYMBOL} ${fullHearts}${hasHalf ? '.5' : ''} (${Math.round(percent)}%)`;
    }
    default: { // symbol style
      const fullHearts = Math.floor(Math.max(0, health / 2));
      const hasHalf = (health % 2) >= 1;
      return `${color}${HEART_SYMBOL} ${fullHearts}${hasHalf ? '.5' : ''}`;
    }
  }
}

// ======= ENTITY UTILITY FUNCTIONS =======
function isLivingEntity(entity) {
  try {
    return entity?.hasComponent(EntityComponentTypes.Health);
  } catch {
    return false;
  }
}

function getBaseName(entity) {
  try {
    if (entity.typeId === 'minecraft:player') return entity.name;
    if (entity.nameTag?.length) return entity.nameTag.split('\n')[0];
    return entity.typeId.replace('minecraft:', '').replaceAll('_', ' ');
  } catch {
    return 'Unknown';
  }
}

// ======= ENTITY NAMETAG UPDATING =======
function updateEntityNameTag(entity) {
  if (!ENABLED) return;
  if (!isLivingEntity(entity)) return;
  if (entity.hasTag(HIDE_TAG)) return;
  
  // Skip sneaking players
  if (entity.typeId === 'minecraft:player') {
    try {
      const sneaking = entity.getComponent('minecraft:is_sneaking')?.value ?? false;
      if (sneaking) {
        entity.nameTag = '';
        return;
      }
    } catch {
      // If error checking sneak state, proceed normally
    }
  }
  
  const healthComp = entity.getComponent(EntityComponentTypes.Health);
  if (!healthComp || typeof healthComp.currentValue !== 'number') return;
  const health = healthComp.currentValue;
  const maxHealth = healthComp.effectiveMax;
  if (health <= 0) return;

  const baseName = getBaseName(entity);
  const heartLine = formatHearts(health, maxHealth);
  let newName = '';

  switch (DISPLAY_MODE) {
    case 'inline':
      newName = `${baseName} ${heartLine}`;
      break;
    case 'above':
      newName = `${heartLine}\n${baseName}`;
      break;
    default: // below
      newName = `${baseName}\n${heartLine}`;
  }

  if (entity.nameTag !== newName) {
    entity.nameTag = newName;
    
    // Add glow effect for players
    if (entity.typeId === 'minecraft:player') {
      try {
        entity.setGlowing(true);
      } catch {
        // Ignore if glow not supported
      }
    }
    
    // Debug log
    const debugPlayers = world.getPlayers().filter(p => p.hasTag(DEBUG_TAG));
    if (debugPlayers.length > 0) {
      console.warn(`[HeartDisplay] ✅ ${entity.typeId} → ${entity.nameTag}`);
    }
  }
}

// ======= GLOBAL UPDATE FUNCTION =======
function updateNameTags() {
  if (!ENABLED) return;

  let updated = 0;
  let skipped = 0;
  const debugPlayers = world.getPlayers().filter(p => p.hasTag(DEBUG_TAG));

  for (const dimensionId of DIMENSIONS) {
    let dimension;
    try {
      dimension = world.getDimension(dimensionId);
    } catch (err) {
      console.warn(`[HeartDisplay] ⚠️ Dimension ${dimensionId} error: ${err}`);
      continue;
    }

    let entities;
    try {
      entities = dimension.getEntities();
    } catch (err) {
      console.warn(`[HeartDisplay] ⚠️ Entity list error: ${err}`);
      continue;
    }

    for (const entity of entities) {
      const prev = entity.nameTag;
      try {
        updateEntityNameTag(entity);
        if (entity.nameTag !== prev) updated++;
        else skipped++;
      } catch (err) {
        console.warn(`[HeartDisplay] ⚠️ Entity error: ${entity?.typeId} – ${err}`);
        skipped++;
      }
    }
  }

  // Send debug info to players with debug tag
  if (updated > 0 || debugPlayers.length > 0) {
    for (const player of debugPlayers) {
      player.sendMessage(`§7[HeartDisplay] §aUpdated: ${updated}, §7Unchanged: ${skipped}`);
    }
    console.warn(`[HeartDisplay] ⏱️ Update complete: ${updated} updated, ${skipped} skipped.`);
  }
}

// ======= SETTINGS FUNCTIONS =======
function applySettings() {
  HEART_SYMBOL = SETTINGS.get('symbol') ?? '❤';
  UPDATE_INTERVAL = SETTINGS.get('interval') ?? 20;
  DISPLAY_MODE = SETTINGS.get('mode') ?? 'below';
  ENABLED = SETTINGS.get('enabled') ?? true;
  DISPLAY_STYLE = SETTINGS.get('style') ?? 'symbol';
  COLOR_CODING = SETTINGS.get('color_coding') ?? true;
}

// ======= UI FUNCTIONS =======
function openHeartMenu(player) {
  const isAdmin = player.hasTag(ADMIN_TAG);
  
  system.runTimeout(() => {
    const form = new ActionFormData()
      .title('❤️ HeartDisplay')
      .button('⚙️ Open Settings', 'textures/ui/settings_glyph_color')
      .button('📄 Show Info', 'textures/ui/icon_book')
      .button('❌ Cancel', 'textures/ui/redX1');

    form.show(player).then(res => {
      if (res.canceled) return;
      if (res.selection === 0) showHeartSettings(player);
      if (res.selection === 1) showHeartInfo(player);
    });
  }, 20);
}

function showHeartSettings(player) {
  player.sendMessage('§7Opening HeartDisplay settings...');

  system.runTimeout(() => {
    try {
      const debug = player.hasTag(DEBUG_TAG);
      const isAdmin = player.hasTag(ADMIN_TAG);
      const hideHearts = player.hasTag(HIDE_TAG);

      const form = new ModalFormData()
        .title('❤️ HeartDisplay Settings')
        .toggle('Show health displays', !hideHearts);
        
      // Only admins can change global settings
      if (isAdmin) {
        form.toggle('Enable HeartDisplay globally', ENABLED)
            .textField('Heart Symbol', 'Symbol to use', HEART_SYMBOL)
            .dropdown('Display Mode', ['Below name', 'Above name', 'Next to name'], 
                      ['below', 'above', 'inline'].indexOf(DISPLAY_MODE))
            .dropdown('Display Style', 
                      ['Symbol (❤ 10)', 'Percentage (50%)', 'Bar |█████     |', 'Numeric (10/20)', 'Mixed (❤ 10 - 50%)'], 
                      ['symbol', 'percent', 'bar', 'numeric', 'mixed'].indexOf(DISPLAY_STYLE))
            .slider('Update Interval (ticks)', 5, 60, 5, UPDATE_INTERVAL)
            .toggle('Color code by health level', COLOR_CODING)
            .toggle('Enable debug output', debug);
      }

      form.show(player).then(res => {
        if (res.canceled) return;
        
        // Process form values
        const values = res.formValues;
        const showHearts = values[0];
        
        // Handle player preference
        if (showHearts) {
          player.removeTag(HIDE_TAG);
          player.sendMessage('§aHealth display enabled for you.');
        } else {
          player.addTag(HIDE_TAG);
          player.sendMessage('§7Health display hidden for you.');
        }
        
        // Handle admin settings
        if (isAdmin && values.length > 1) {
          const [, enabled, symbol, modeIndex, styleIndex, interval, colorCoding, debugView] = values;
          
          // Update global settings
          ENABLED = enabled;
          HEART_SYMBOL = symbol || '❤';
          DISPLAY_MODE = ['below', 'above', 'inline'][modeIndex];
          DISPLAY_STYLE = ['symbol', 'percent', 'bar', 'numeric', 'mixed'][styleIndex];
          UPDATE_INTERVAL = interval;
          COLOR_CODING = colorCoding;
          
          // Save to database
          SETTINGS.set('enabled', ENABLED);
          SETTINGS.set('symbol', HEART_SYMBOL);
          SETTINGS.set('mode', DISPLAY_MODE);
          SETTINGS.set('style', DISPLAY_STYLE);
          SETTINGS.set('interval', UPDATE_INTERVAL);
          SETTINGS.set('color_coding', COLOR_CODING);
          
          // Handle debug tag
          if (debugView) {
            player.addTag(DEBUG_TAG);
            player.sendMessage('§eDebug mode enabled. Check console for output.');
          } else {
            player.removeTag(DEBUG_TAG);
            player.sendMessage('§7Debug mode disabled.');
          }
          
          player.sendMessage(`§aHeartDisplay settings saved.`);
        }
        
        // Force update
        updateNameTags();
      });
    } catch (err) {
      console.warn(`[HeartDisplay] ⚠️ Menu error for ${player.name}: ${err}`);
    }
  }, 60);
}

function showHeartInfo(player) {
  player.sendMessage(
    '§b====== HeartDisplay Plugin Info ======\n' +
    '§7• Displays health information for entities\n' +
    '§7• Color changes based on health level\n' +
    '§7• Sneaking hides your display\n' +
    '§7• Players get a glow effect\n' +
    '§7• Configurable via UI or commands\n\n' +
    '§6Commands:\n' +
    '§e/hearts§7 - Open main menu\n' +
    '§e/hidehearts§7 - Hide health display for you\n' +
    '§e/showhearts§7 - Show health display again'
  );
}

// ======= COMMAND REGISTRATION =======
function registerCommands() {
  if (!bridge?.bedrockCommands) {
    console.warn('[HeartDisplay] ❌ Bridge command registration not available.');
    return;
  }

  // Safe command registration with fallbacks
  const safeRegisterCommand = (name, callback, description, isAdmin = false) => {
    try {
      // Define the proper wrapper function that handles undefined args
      const wrappedCallback = (player, args = []) => {
        try {
          callback(player, args || []);
        } catch (callbackError) {
          console.warn(`[HeartDisplay] ⚠️ Command error (${name}): ${callbackError}`);
          player.sendMessage(`§c[HeartDisplay] Command error: ${callbackError.message}`);
        }
      };
      
      if (isAdmin && bridge.bedrockCommands.registerAdminCommand) {
        bridge.bedrockCommands.registerAdminCommand(name, wrappedCallback, description);
      } else if (bridge.bedrockCommands.registerCommand) {
        bridge.bedrockCommands.registerCommand(name, wrappedCallback, description);
      }
      console.warn(`[HeartDisplay] ✅ Registered command: ${name}`);
      return true;
    } catch (error) {
      console.warn(`[HeartDisplay] ⚠️ Could not register command ${name}: ${error.message}`);
      
      // Try with prefix
      try {
        const uniqueName = `hdp_${name}`;
        const wrappedCallback = (player, args = []) => {
          try {
            callback(player, args || []);
          } catch (callbackError) {
            console.warn(`[HeartDisplay] ⚠️ Command error (${uniqueName}): ${callbackError}`);
          }
        };
        
        if (isAdmin && bridge.bedrockCommands.registerAdminCommand) {
          bridge.bedrockCommands.registerAdminCommand(uniqueName, wrappedCallback, description);
        } else if (bridge.bedrockCommands.registerCommand) {
          bridge.bedrockCommands.registerCommand(uniqueName, wrappedCallback, description);
        }
        console.warn(`[HeartDisplay] ✅ Registered alternative command: ${uniqueName}`);
        return true;
      } catch (secondError) {
        console.warn(`[HeartDisplay] ❌ Failed to register command: ${secondError.message}`);
        return false;
      }
    }
  };

  // Register main command
  safeRegisterCommand('hearts', (player) => {
    openHeartMenu(player);
  }, 'Opens the HeartDisplay settings menu.');

  // Register utility commands
  safeRegisterCommand('hidehearts', (player) => {
    player.addTag(HIDE_TAG);
    player.sendMessage('§7HeartDisplay hidden for you.');
  }, 'Hides HeartDisplay only for you.');

  safeRegisterCommand('showhearts', (player) => {
    player.removeTag(HIDE_TAG);
    player.sendMessage('§7HeartDisplay shown again.');
  }, 'Shows HeartDisplay again.');

  // Register admin command
  safeRegisterCommand('testhearts', (player) => {
    player.sendMessage('§b[HeartDisplay] Manual update triggered...');
    updateNameTags();
  }, 'Manually updates visible HeartDisplays.', true);

  console.warn('[HeartDisplay] ✅ Command registration completed.');
}

// ======= CHAT COMMAND HANDLING =======
world.beforeEvents.chatSend.subscribe(event => {
  if (event.message?.trim()?.toLowerCase() === '!hearts') {
    event.cancel = true;
    openHeartMenu(event.sender);
  }
});

// ======= INITIALIZATION =======
try {
  if (bridge?.events?.bridgeInitialize) {
    console.warn('[HeartDisplay] Registering with bridge initialization event...');
    
    bridge.events.bridgeInitialize.subscribe(() => {
      try {
        registerCommands();
      } catch (err) {
        console.warn(`[HeartDisplay] ❌ Error during command registration: ${err}`);
        
        // Fallback initialization after delay
        system.runTimeout(() => {
          try {
            registerCommands();
          } catch (secondError) {
            console.warn(`[HeartDisplay] ❌ Critical command registration error: ${secondError}`);
          }
        }, 100);
      }
    });
  } else {
    // Initialize after a delay if bridge isn't available
    console.warn('[HeartDisplay] No bridge event available, registering commands directly...');
    system.runTimeout(() => {
      registerCommands();
    }, 60);
  }
} catch (err) {
  console.warn(`[HeartDisplay] ❌ Bridge setup error: ${err}`);
  
  // Last resort initialization
  system.runTimeout(() => {
    registerCommands();
  }, 120);
}

// ======= EVENT SUBSCRIPTIONS =======
// Regular update interval
system.runInterval(() => {
  try {
    applySettings();
    updateNameTags();
  } catch (err) {
    console.warn(`[HeartDisplay] ❌ Interval error: ${err}`);
  }
}, UPDATE_INTERVAL);

// Health change event
world.afterEvents.entityHealthChanged.subscribe(event => {
  try {
    const affected = event.entity;
    if (!affected) return;
    updateEntityNameTag(affected);
  } catch (err) {
    console.warn(`[HeartDisplay] ⚠️ Health update error: ${err}`);
  }
});

// ======= STARTUP MESSAGE =======
system.run(() => {
  applySettings();
  console.warn(`[HeartDisplay Plugin] ✅ Fully initialized (every ${UPDATE_INTERVAL} ticks)`);
});