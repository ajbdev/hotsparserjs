const column = require('./lib/column');

var battleGround = new Plugin('BattleGround', 'Information about the BattleGround played on');
battleGround.parse(
  'tracker_events'
);
