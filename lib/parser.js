const heroprotocol = require('heroprotocoljs');
const EventEmitter = require('events');

export default class Parser extends EventEmitter {
  constructor(file) {
    this.file = file;
    this.columns = [];
    this.parts = {
      DETAILS: false,
      TRACKER_EVENTS: false,
      ATTRIBUTES_EVENTS: false,
      GAME_EVENTS: false
    };
  }
  addColumn(column) {
    column.active = true;

    this.columns[column.name] = column;

    this.resolveDependencies(column);
  }
  parse() {
    this.parts = {
      DETAILS:  heroprotocol.get(heroprotocol.DETAILS, this.file),
      TRACKER_EVENTS: heroprotocol.get(heroprotocol.TRACKER_EVENTS, this.file),
      ATTRIBUTES_EVENTS: heroprotocol.get(heroprotocol.ATTRIBUTES_EVENTS, this.file),
      GAME_EVENTS: heroprotocol.get(heroprotocol.GAME_EVENTS, this.file)
    };

    this.emit('parse.start', this.parts);
    for (var p in this.parts) {
      if (p === 'DETAILS') {
        continue;
      }

      let events = this.parts[p];
      for (var e in events) {
        let evt = events[e];

        this.emit(e.toLowerCase(), evt);
      }
    }

    this.emit('parse.end');
  }
  resolveDependencies(column) {
    let dependencies = column.dependencies();

    for (var d in dependencies) {
      this.addColumn(dependencies[d]);
    }
  }
}
