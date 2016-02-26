const heroprotocol = require('heroprotocoljs');
const EventEmitter = require('events');

export default class Parser extends EventEmitter {
  constructor(file) {
    this.file = file;
    this.plugins = [];
    this.parts = {
      DETAILS: false,
      TRACKER_EVENTS: false,
      ATTRIBUTES_EVENTS: false,
      GAME_EVENTS: false
    };
    this.replay = {};
  }
  addplugin(plugin) {
    plugin.active = true;

    this.plugins[plugin.name] = plugin;

    this.resolveDependencies(plugin);
  }
  get replay() {
    return this.replay;
  }
  parse() {
    this.plugins.reverse();

    this.parts = {
      DETAILS:  heroprotocol.get(heroprotocol.DETAILS, this.file),
      TRACKER_EVENTS: heroprotocol.get(heroprotocol.TRACKER_EVENTS, this.file),
      ATTRIBUTES_EVENTS: heroprotocol.get(heroprotocol.ATTRIBUTES_EVENTS, this.file),
      GAME_EVENTS: heroprotocol.get(heroprotocol.GAME_EVENTS, this.file)
    };

    this.emit('parse.start', this.replay, this.parts);
    for (var p in this.parts) {
      if (p === 'DETAILS') {
        continue;
      }

      let events = this.parts[p];
      for (var e in events) {
        let ns = events[e];
        var evt = events[e].m_eventName;

        this.emit(ns.toLowerCase() + '.' + evt, this.replay, evt);
      }
    }

    this.emit('parse.end');
  }
  resolveDependencies(plugin) {
    let dependencies = plugin.dependencies();

    for (var d in dependencies) {
      this.addplugin(dependencies[d]);
    }
  }
}
