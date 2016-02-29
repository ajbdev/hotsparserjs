# hotsparserjs
hotsparserjs is a node based parser for Heroes of the Storm replay files.
The goal of this project is to create a clean, well formatted data structure from replays.
The top objectives of this parser are:
- Keep the data structure relevant to actual game information and trim any internal technical information
- Allow conditional parsing of specific data
- Make it easy to extend the parser for more


## Parser Plugins
Data parsing hotsparserjs is not hard coded. A basic data parsing framework
exists in the parser module, and then specific data parsing is implemented in the
parsers module. Each parser is implemented via a parser plugin that hooks into events
fired from the main loop.

## Parsing events
The parser fires the following events that can be intercepted by the plugin:
- parse.start: Signals the start of parsing. Receives all decoded replay data as an argument
- DETAILS: This passes along information decoded from the details portion of the replay
- [EVENT_TYPE].[EVENT_NAME]: Events that are fired from the replay file (see below for examples)
- parse.end: Signals the end of parsing.


## Replay specific event data
The following events are fired in the parsing loop:
 - TRACKER_EVENTS.NNet.Replay.Tracker.SPlayerSetupEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitBornEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUpgradeEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SStatGameEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitDiedEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitPositionsEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitOwnerChangeEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitRevivedEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SUnitTypeChangeEvent
 - TRACKER_EVENTS.NNet.Replay.Tracker.SScoreResultEvent
 - GAME_EVENTS.NNet.Game.SBankFileEvent
 - GAME_EVENTS.NNet.Game.SBankSectionEvent
 - GAME_EVENTS.NNet.Game.SBankKeyEvent
 - GAME_EVENTS.NNet.Game.SBankSignatureEvent
 - GAME_EVENTS.NNet.Game.SUserFinishedLoadingSyncEvent
 - GAME_EVENTS.NNet.Game.STriggerSoundLengthSyncEvent
 - GAME_EVENTS.NNet.Game.SUserOptionsEvent
 - GAME_EVENTS.NNet.Game.SCameraUpdateEvent
 - GAME_EVENTS.NNet.Game.SSelectionDeltaEvent
 - GAME_EVENTS.NNet.Game.SCmdEvent
 - GAME_EVENTS.NNet.Game.SCmdUpdateTargetPointEvent
 - GAME_EVENTS.NNet.Game.SCommandManagerStateEvent
 - GAME_EVENTS.NNet.Game.SCmdUpdateTargetUnitEvent
 - GAME_EVENTS.NNet.Game.SControlGroupUpdateEvent
 - GAME_EVENTS.NNet.Game.SHeroTalentTreeSelectedEvent
 - GAME_EVENTS.NNet.Game.STriggerTransmissionOffsetEvent
 - GAME_EVENTS.NNet.Game.STriggerTransmissionCompleteEvent
 - GAME_EVENTS.NNet.Game.STriggerDialogControlEvent
 - GAME_EVENTS.NNet.Game.STriggerSoundOffsetEvent
 - GAME_EVENTS.NNet.Game.SUnitClickEvent
 - GAME_EVENTS.NNet.Game.STriggerSoundtrackDoneEvent
 - GAME_EVENTS.NNet.Game.STriggerPingEvent
 - GAME_EVENTS.NNet.Game.STriggerCutsceneEndSceneFiredEvent
 - GAME_EVENTS.NNet.Game.SGameUserLeaveEvent
 - MESSAGE_EVENTS.NNet.Game.SLoadingProgressMessage
 - MESSAGE_EVENTS.NNet.Game.SPingMessage
 - MESSAGE_EVENTS.NNet.Game.SChatMessage

## Extending the parser
It's very easy to extend the parser to do any sort of analysis upon replays that you
want. Simply write a new parser plugin and attach it.
