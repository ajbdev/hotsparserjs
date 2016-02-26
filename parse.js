const heroprotocol = require('heroprotocoljs');
const file = '../replays/Tomb of the Spider Queen (120).StormReplay';
const details = heroprotocol.get(heroprotocol.DETAILS, file);
const gameEvents = heroprotocol.get(heroprotocol.GAME_EVENTS, file);
const trackerEvents = heroprotocol.get(heroprotocol.TRACKER_EVENTS, file);
const attributeEvents = heroprotocol.get(heroprotocol.ATTRIBUTES_EVENTS, file);

const parser = require('./parser');
