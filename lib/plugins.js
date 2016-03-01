"use strict";
const plugin = require('./parser').Plugin;
const rgbHex = require('rgb-hex');
const heroesJson = require('./heroes');

exports.plugins = {};

let battleGround = exports.plugins.BattleGround = plugin('Battle Ground', 'Information about the map', {
  BattleGround: null
});

battleGround.parse('replay.details', function(evt) {
  battleGround.values.BattleGround = evt.m_title;
});

let heroes = exports.plugins.Heroes = plugin('Hero', 'Basic hero data', {
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
