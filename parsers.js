"use strict";
const plugin = require('./lib/parser').Plugin;
const rgbHex = require('rgb-hex');
const heroesJson = require('./lib/heroes');

let battleGround = exports.BattleGround = plugin('Battle Ground', 'Information about the map', {
  BattleGround: null
});

battleGround.parse('replay.details', function(evt) {
  battleGround.values.BattleGround = evt.m_title;
});

let heroes = exports.Heroes = plugin('Hero', 'Basic hero data', {
  Heroes: []
});

heroes.parse('NNet.Replay.Tracker.SUnitBornEvent', function(evt) {
  if (evt.m_unitTypeName.substring(0,4) == 'Hero') {
    let id = evt.m_unitTypeName.substring(4);
    let name = '';
    for (var h in heroesJson) {
      let hero = heroesJson[h];

      if (id == hero.id) {
        name = hero.name;
      }
    }
    if (!name) {
      // Handle some edge cases such as TLV who don't have individual heroesjson data
      name = id;
    }

    heroes.value.Heroes.push({
      Id: id,
      Name: name,
      PlayerId: evt.m_upkeepPlayerId,
      Statistics: {},
      // The following data points are just for the parser
      // They will be cleaned up when the parser ends
      index: evt.m_upkeepPlayerId - 1,
      unitTagIndex: evt.m_unitTagIndex,
      unitTagRecycle: evt.m_unitTagRecycle,
    });
  }
}).parse('NNet.Replay.Tracker.SScoreResultEvent', function(evt) {
  let stats = evt.m_instanceList;
  for (var s in stats) {
    let stat = stats[s];

    for (var v in stat.m_values) {
      let val = stat.m_values[v];

      for (var h in heroes.value.Heroes) {
        let hero = heroes.value.Heroes[h];

        if (hero.index == v && val.length > 0) {
          hero.Statistics[stat.m_name] = val[0].m_value;
        }
      }
    }
  }
}).parse('replay.details', function(details) {
  for (var p in details.m_playerList) {
    let player = details.m_playerList[p];

    for (var h in heroes.value.Heroes) {
      let hero = heroes.value.Heroes[h];
      if (hero.Name == player.m_hero) {
        let color = player.m_color;

        hero.Player = {
          Id: player.m_toon.m_id,
          Name: player.m_name,
          TeamId: player.m_teamId,
          Color: {
            Hex: rgbHex(color.m_r, color.m_g, color.m_b),
            Alpha: color.m_a
          }
        };
      }
    }
  }
}).parse('parse.end', function() {
  // Clean up variables needed only for the sake of parsing
  for (var h in heroes.value.Heroes) {
    let hero = heroes.value.Heroes[h];
    delete hero.index;
    delete hero.unitTagIndex;
    delete hero.unitTagRecycle;
  }
});


/*
Event list:
[ 'TRACKER_EVENTS.NNet.Replay.Tracker.SPlayerSetupEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SPlayerSetupEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitBornEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitBornEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUpgradeEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUpgradeEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SStatGameEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SStatGameEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitDiedEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitDiedEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitPositionsEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitPositionsEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitOwnerChangeEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitOwnerChangeEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitRevivedEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitRevivedEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitTypeChangeEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SUnitTypeChangeEvent',
  'TRACKER_EVENTS.NNet.Replay.Tracker.SScoreResultEvent': 'TRACKER_EVENTS.NNet.Replay.Tracker.SScoreResultEvent',
  'GAME_EVENTS.NNet.Game.SBankFileEvent': 'GAME_EVENTS.NNet.Game.SBankFileEvent',
  'GAME_EVENTS.NNet.Game.SBankSectionEvent': 'GAME_EVENTS.NNet.Game.SBankSectionEvent',
  'GAME_EVENTS.NNet.Game.SBankKeyEvent': 'GAME_EVENTS.NNet.Game.SBankKeyEvent',
  'GAME_EVENTS.NNet.Game.SBankSignatureEvent': 'GAME_EVENTS.NNet.Game.SBankSignatureEvent',
  'GAME_EVENTS.NNet.Game.SUserFinishedLoadingSyncEvent': 'GAME_EVENTS.NNet.Game.SUserFinishedLoadingSyncEvent',
  'GAME_EVENTS.NNet.Game.STriggerSoundLengthSyncEvent': 'GAME_EVENTS.NNet.Game.STriggerSoundLengthSyncEvent',
  'GAME_EVENTS.NNet.Game.SUserOptionsEvent': 'GAME_EVENTS.NNet.Game.SUserOptionsEvent',
  'GAME_EVENTS.NNet.Game.SCameraUpdateEvent': 'GAME_EVENTS.NNet.Game.SCameraUpdateEvent',
  'GAME_EVENTS.NNet.Game.SSelectionDeltaEvent': 'GAME_EVENTS.NNet.Game.SSelectionDeltaEvent',
  'GAME_EVENTS.NNet.Game.SCmdEvent': 'GAME_EVENTS.NNet.Game.SCmdEvent',
  'GAME_EVENTS.NNet.Game.SCmdUpdateTargetPointEvent': 'GAME_EVENTS.NNet.Game.SCmdUpdateTargetPointEvent',
  'GAME_EVENTS.NNet.Game.SCommandManagerStateEvent': 'GAME_EVENTS.NNet.Game.SCommandManagerStateEvent',
  'GAME_EVENTS.NNet.Game.SCmdUpdateTargetUnitEvent': 'GAME_EVENTS.NNet.Game.SCmdUpdateTargetUnitEvent',
  'GAME_EVENTS.NNet.Game.SControlGroupUpdateEvent': 'GAME_EVENTS.NNet.Game.SControlGroupUpdateEvent',
  'GAME_EVENTS.NNet.Game.SHeroTalentTreeSelectedEvent': 'GAME_EVENTS.NNet.Game.SHeroTalentTreeSelectedEvent',
  'GAME_EVENTS.NNet.Game.STriggerTransmissionOffsetEvent': 'GAME_EVENTS.NNet.Game.STriggerTransmissionOffsetEvent',
  'GAME_EVENTS.NNet.Game.STriggerTransmissionCompleteEvent': 'GAME_EVENTS.NNet.Game.STriggerTransmissionCompleteEvent',
  'GAME_EVENTS.NNet.Game.STriggerDialogControlEvent': 'GAME_EVENTS.NNet.Game.STriggerDialogControlEvent',
  'GAME_EVENTS.NNet.Game.STriggerSoundOffsetEvent': 'GAME_EVENTS.NNet.Game.STriggerSoundOffsetEvent',
  'GAME_EVENTS.NNet.Game.SUnitClickEvent': 'GAME_EVENTS.NNet.Game.SUnitClickEvent',
  'GAME_EVENTS.NNet.Game.STriggerSoundtrackDoneEvent': 'GAME_EVENTS.NNet.Game.STriggerSoundtrackDoneEvent',
  'GAME_EVENTS.NNet.Game.STriggerPingEvent': 'GAME_EVENTS.NNet.Game.STriggerPingEvent',
  'GAME_EVENTS.NNet.Game.STriggerCutsceneEndSceneFiredEvent': 'GAME_EVENTS.NNet.Game.STriggerCutsceneEndSceneFiredEvent',
  'GAME_EVENTS.NNet.Game.SGameUserLeaveEvent': 'GAME_EVENTS.NNet.Game.SGameUserLeaveEvent',
  'ATTRIBUTES_EVENTS.undefined': 'ATTRIBUTES_EVENTS.undefined',
  'MESSAGE_EVENTS.NNet.Game.SLoadingProgressMessage': 'MESSAGE_EVENTS.NNet.Game.SLoadingProgressMessage',
  'MESSAGE_EVENTS.NNet.Game.SPingMessage': 'MESSAGE_EVENTS.NNet.Game.SPingMessage',
  'MESSAGE_EVENTS.NNet.Game.SChatMessage': 'MESSAGE_EVENTS.NNet.Game.SChatMessage' ]
  */
