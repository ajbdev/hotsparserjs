"use strict";
const events = require('events');
const EventEmitter = new events.EventEmitter();
const heroprotocol = require('heroprotocoljs');
const merge = require('deepmerge');

let parser = exports.Parser = function(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  let canOpen = heroprotocol.open(file);

  if (canOpen instanceof Error) {
    throw canOpen;
  }

  return {
    plugins: [],
    replay: {},
    parts: {},

    // Compose all plugin values together into one object
    compose: function() {
      for (var p in this.plugins) {
        this.replay = merge(this.replay, this.plugins[p].value);
      }

      return this.replay;
    },

    getReplayPart: function(part) {
      if (!this.parts.hasOwnProperty(part)) {
        this.parts[part] = heroprotocol.get(part, file);
      }
      return this.parts[part];
    },

    parse: function() {
      this.plugins.reverse();

      for (var l in this.plugins) {
        this.plugins[l].activate();
      }

      this.getReplayPart(heroprotocol.GAME_EVENTS);
      this.getReplayPart(heroprotocol.TRACKER_EVENTS);
      this.getReplayPart(heroprotocol.ATTRIBUTES_EVENTS);
      this.getReplayPart(heroprotocol.MESSAGE_EVENTS);
      this.getReplayPart(heroprotocol.DETAILS);

      EventEmitter.emit('parse.start', this.parts);
      for (var p in this.parts) {
        if (p === heroprotocol.DETAILS) {
          EventEmitter.emit(heroprotocol.DETAILS,this.parts[p]);
          continue;
        }

        let events = this.parts[p];
        for (var e in events) {
          let event = events[e];
          let name = events[e]._event;

          EventEmitter.emit(name, event);
        }
      }
      EventEmitter.emit('parse.end');

      return this.compose();
    }

  };
};

let plugin = exports.Plugin = function(name, description, structure) {
  return {
    name: name,
    description: description,
    active: false,
    parsers: [],

    // The value property is what will get merged into the final data structure
    // All parsers should manipulate this property
    value: structure,

    parse: function(event, fn) {
      this.parsers.push({
        event: event,
        fn: fn
      });

      return this;
    },

    activate: function() {
      if (this.active) {
        return;
      }

      for (var p in this.parsers) {
        let parser = this.parsers[p];
        EventEmitter.on(parser.event, parser.fn);
      }

      this.active = true;
    }
  };
};
