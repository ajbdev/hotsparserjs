const EventEmitter = require('events');

export default class Column extends EventEmitter {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.requires = [];
    this.value = undefined;
    this.active = false;
    this.parsers = [];
  }

  parse(event, fn) {
    this.parsers.push({
      event: event,
      fn: fn
    });

    return this;
  }

  activate() {
    this.active = true;
    if (this.active) {
      return;
    }

    for (var p in this.parsers) {
      let parser = this.parsers[p];
      this.on(parser.event, parser.fn);
    }

    return this;
  }

  get dependencies() {
    return this.requires;
  }

  require(column) {
    this.requires.push(column);
  }
}
