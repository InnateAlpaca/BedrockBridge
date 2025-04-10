// 🎥 BedrockBridge AFK Camera Plugin – Ultra Edition COMPLETE ULTIMATE
// by poweroffapt
//
// This advanced AFK (Away From Keyboard) plugin brings cinematic camera movement, real-time AFK detection, 
// and full Discord/scoreboard integration to Minecraft Bedrock Edition using BedrockBridge.
//
// ✅ Main Features:
// - Detects player inactivity via position and rotation
// - Enables cinematic camera with randomized angles, zoom, and smooth fades
// - Sends Discord embed messages when players go AFK or return
// - UI-based configuration (open with slime ball if tagged as "admin")
// - Supports manual AFK toggling via /afk command
// - Displays live AFK time via scoreboard objective "afk_time"
// - Optionally kicks players after a configurable idle time
// - Supports admin exclusion, status notifications, and anti-spam control
// - Fully integrated with BedrockBridge: bridge, bridgeDirect, database
//
// ⚙️ Configurable Options (via UI):
// - AFK Time (seconds) → Delay before a player is marked as AFK
// - Kick Enabled → Whether AFK players should be kicked
// - Kick Delay (seconds) → Time after AFK status before kicking
// - AFK Message → Chat message when someone becomes AFK
// - Return Message → Chat message when AFK ends
// - Warning Message → Sent before a player is kicked (supports {kickDelay})
// - Kick Reason → Message shown when player is kicked
// - Ignore Admins → Prevents kicking or tagging AFK for admins
// - Notify Everyone → Broadcasts status and kick messages to all players
// - Show Status Changes → Notifies everyone when someone goes AFK or returns
//
// 📊 Data Handling:
// - AFK time is tracked in scoreboard ("afk_time")
// - All AFK events are stored in database (afkCameraStats)
// - Discord embeds include timestamp, tick info, and player head icon
//
// 🔧 Requirements:
// - Minecraft Bedrock 1.21.70+ with Script API v2
// - BedrockBridge environment (with bridgeDirect & database enabled)
//
// 🧪 Tip: Type `/afk` to toggle AFK mode manually.
// 🎮 Admins can open the config UI by using a slime ball.
//
// 💡 Created by poweroffapt – optimized for TrophyNetwork and advanced Bedrock servers.

import { system, world, DisplaySlotId } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { bridge, bridgeDirect, database } from "../addons";

// BridgeDirect initialisieren
bridge.events.bridgeInitialize.subscribe(e => {
  e.registerAddition("discord_direct");
  console.warn("✅ DiscordDirect enabled for AFK plugin");
});

const AFK_TAG = "isAfk";
const CAMERA_PRESETS = [
  { x: 2, y: 1.5, z: 2 },
  { x: -2, y: 2, z: -2 },
  { x: 0, y: 3, z: 0 },
  { x: 1, y: 2, z: -1 }
];

const CONFIG_KEYS = {
  idleTime: "timeIdleRequired",
  kickEnabled: "kickEnabled",
  kickDelay: "kickDelay",
  afkMessage: "afkMessage",
  notAfkMessage: "notAfkMessage",
  warnMessage: "warnMessage",
  kickReason: "kickReason",
  ignoreAdmins: "ignoreAdmins",
  notifyAll: "notifyAll",
  notifyStatusChanges: "notifyStatusChanges"
};

const defaultConfig = {
  idleTime: 300,
  kickEnabled: true,
  kickDelay: 180,
  afkMessage: "§7{player} is now AFK.",
  notAfkMessage: "§7{player} has returned from AFK.",
  warnMessage: "§cStay AFK and you'll be kicked in {kickDelay} seconds!",
  kickReason: "You’ve been AFK for too long.",
  ignoreAdmins: true,
  notifyAll: true,
  notifyStatusChanges: true
};

const config = {};
const playerStates = new Map();
const afkStats = database.makeTable("afkCameraStats");
const afkTimeObjective = world.scoreboard.getObjective("afk_time") || world.scoreboard.addObjective("afk_time", "AFK time (min)");

for (const [key, def] of Object.entries(defaultConfig)) {
  let val = world.getDynamicProperty(CONFIG_KEYS[key]);
  if (val === undefined) {
    val = def;
    world.setDynamicProperty(CONFIG_KEYS[key], val);
  }
  config[key] = val;
}

function showConfigUI(player) {
  new ModalFormData()
.title("AFK Camera Settings")
.textField("AFK Time (seconds)", "", config.idleTime.toString())
.toggle("Enable AFK Kick", config.kickEnabled)
.textField("Kick Delay (seconds)", "", config.kickDelay.toString())
.textField("AFK Message", "", config.afkMessage)
.textField("Return Message", "", config.notAfkMessage)
.textField("Warning Message", "", config.warnMessage)
.textField("Kick Reason", "", config.kickReason)
.toggle("Ignore Admins", config.ignoreAdmins)
.toggle("Notify Everyone", config.notifyAll)
.toggle("Show Status Changes", config.notifyStatusChanges)
    .show(player).then(({ canceled, formValues }) => {
      if (canceled) return;
      try {
        const keys = Object.keys(defaultConfig);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let raw = formValues[i];
          config[key] = typeof defaultConfig[key] === "boolean" ? raw : isNaN(parseInt(raw)) ? raw : parseInt(raw);
          world.setDynamicProperty(CONFIG_KEYS[key], config[key]);
        }
        player.sendMessage("§aSuccessfully saved AFK configuration.");
      } catch (e) {
        player.sendMessage("§cInvalid value:" + e);
      }
    });
}

function applyCameraEffect(player) {
  const preset = CAMERA_PRESETS[Math.floor(Math.random() * CAMERA_PRESETS.length)];
  const fade = Math.random();
  if (fade > 0.7) {
    player.camera.fade({ fadeTime: { fadeInTime: fade, holdTime: 0.5, fadeOutTime: fade } });
  }
  player.camera.setCamera("minecraft:free", {
    location: {
      x: player.location.x + preset.x,
      y: player.getHeadLocation().y + preset.y,
      z: player.location.z + preset.z
    },
    facingLocation: player.getHeadLocation(),
    rotation: { x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60 },
    zoom: 1 + Math.random() * 0.5,
    easeOptions: { easeTime: 2.5 }
  });
}

function clearCameraIfAFK(player) {
  try {
    if (player.hasTag(AFK_TAG)) {
      player.removeTag(AFK_TAG);
      player.camera.clear();
      world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
    }
  } catch {}
}

world.afterEvents.playerJoin.subscribe(ev => {
  clearCameraIfAFK(ev.player);
});

function formatDuration(ticks) {
  const totalSec = Math.floor(ticks / 20);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min > 0 ? min + " minute" + (min !== 1 ? "s" : "") + " " : ""}${sec} second${sec !== 1 ? "s" : ""}`;
}

function sendDiscordEmbed(title, description, color, playerName) {
  if (!bridgeDirect?.ready) return;
  bridgeDirect.sendEmbed({
    title,
    description,
    color,
    timestamp: new Date().toISOString(),
    footer: { text: `Tick: ${system.currentTick}` }
  }, "AFK system", `https://mc-heads.net/avatar/${playerName}`);
}

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (config.ignoreAdmins && player.hasTag("admin")) continue;

    const name = player.name;
    const state = playerStates.get(name) || {
      lastX: player.location.x,
      lastY: player.location.y,
      lastZ: player.location.z,
      rotX: player.getRotation().x,
      rotY: player.getRotation().y,
      idle: 0,
      afkStartTick: 0,
      warned: false
    };

    const moved =
      Math.abs(player.location.x - state.lastX) > 0.05 ||
      Math.abs(player.location.y - state.lastY) > 0.05 ||
      Math.abs(player.location.z - state.lastZ) > 0.05 ||
      Math.abs(player.getRotation().x - state.rotX) > 2 ||
      Math.abs(player.getRotation().y - state.rotY) > 2;

    if (moved) {
      if (player.hasTag(AFK_TAG)) {
        clearCameraIfAFK(player);
        if (config.notifyStatusChanges) world.sendMessage(config.notAfkMessage.replace("{player}", name));
        const afkTicks = system.currentTick - state.afkStartTick;
        sendDiscordEmbed("AFK ended", `✅ ${name} is no longer AFK (after ${formatDuration(afkTicks)})`, 0x00ff00, name);
      }
      state.idle = 0;
      state.warned = false;
    } else {
      state.idle++;
      if (!player.hasTag(AFK_TAG) && state.idle >= config.idleTime * 20) {
        player.addTag(AFK_TAG);
        state.afkStartTick = system.currentTick;
        world.sendMessage(config.afkMessage.replace("{player}", name));
        sendDiscordEmbed("AFK started", `🛌 ${name} is now AFK`, 0xffff00, name);
        afkStats.set(`afk_${name}_${system.currentTick}`, { player: name, tick: system.currentTick, status: "afk" });
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: afkTimeObjective });
      }
      if (player.hasTag(AFK_TAG)) {
        if (!state.warned) {
          player.sendMessage(config.warnMessage.replace("{kickDelay}", config.kickDelay.toString()));
          state.warned = true;
        }
        if (config.kickEnabled && state.idle >= (config.idleTime + config.kickDelay) * 20) {
          world.getDimension("overworld").runCommandAsync(`kick ${name} ${config.kickReason}`);
          if (config.notifyAll) world.sendMessage(`§c${name} was kicked due to inactivity.`);
        }
        if (state.idle % 80 === 0) applyCameraEffect(player);
        afkTimeObjective.setScore(player, Math.floor(state.idle / 1200));
      }
    }

    state.lastX = player.location.x;
    state.lastY = player.location.y;
    state.lastZ = player.location.z;
    state.rotX = player.getRotation().x;
    state.rotY = player.getRotation().y;
    playerStates.set(name, state);
  }
}, 1);

bridge.bedrockCommands.registerAdminCommand("afk", (player) => {
  const state = playerStates.get(player.name) || { idle: 0 };
  if (player.hasTag(AFK_TAG)) {
    clearCameraIfAFK(player);
    player.sendMessage("§aYou have exited AFK mode manually.\nCamera has been reset.");
    sendDiscordEmbed("AFK ended", `✅ ${player.name} is no longer AFK (manual).`, 0x00ff00, player.name);
  } else {
    player.addTag(AFK_TAG);
    state.afkStartTick = system.currentTick;
    player.sendMessage("§eAFK mode activated (manual). Setting camera...");
    world.sendMessage(config.afkMessage.replace("{player}", player.name));
    sendDiscordEmbed("AFK started", `🛌 ${player.name} is now AFK (manual).`, 0xffff00, player.name);
    afkStats.set(`afk_manual_${player.name}_${system.currentTick}`, { player: player.name, tick: system.currentTick, status: "afk_manual" });
    applyCameraEffect(player);
    world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: afkTimeObjective });
  }
  playerStates.set(player.name, state);
}, "Switch AFK mode manually");

world.afterEvents.itemUse.subscribe(ev => {
  if (ev.itemStack.typeId === "minecraft:slime_ball" && ev.source.hasTag("admin")) showConfigUI(ev.source);
});

console.log("🎥 AFK Camera Plugin initialized successfully.");
