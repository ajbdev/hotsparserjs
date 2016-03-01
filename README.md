# hotsparserjs
hotsparserjs is a node based parser for Heroes of the Storm replay files.
The goal of this project is to create a clean, well formatted data structure from replays.
The top objectives of this parser are:
- Keep the data structure relevant to actual game information and trim any internal technical information
- Allow conditional parsing of specific data
- Make it easy to extend the parser to more easily support doing any kind of data analysis


## Parser Plugins
Data parsing hotsparserjs is not hard coded. A basic data parsing framework
exists in the parser module, and then specific data parsing is implemented in the
parsers module. Each parser is implemented via a parser plugin that hooks into events
fired from the main loop.

## Parsing events
The parser fires the following events that can be intercepted by the plugin:
- parse.start: Signals the start of parsing. Receives all decoded replay data as an argument
- DETAILS: This passes along information decoded from the details portion of the replay
- [.[: Events that are fired from the replay file (see below for examples)
- parse.end: Signals the end of parsing.


## Replay specific event data
The following events are fired in the parsing loop:
 - NNet.Replay.Tracker.SPlayerSetupEvent
 - NNet.Replay.Tracker.SUnitBornEvent
 - NNet.Replay.Tracker.SUpgradeEvent
 - NNet.Replay.Tracker.SStatGameEvent
 - NNet.Replay.Tracker.SUnitDiedEvent
 - NNet.Replay.Tracker.SUnitPositionsEvent
 - NNet.Replay.Tracker.SUnitOwnerChangeEvent
 - NNet.Replay.Tracker.SUnitRevivedEvent
 - NNet.Replay.Tracker.SUnitTypeChangeEvent
 - NNet.Replay.Tracker.SScoreResultEvent
 - NNet.Game.SBankFileEvent
 - NNet.Game.SBankSectionEvent
 - NNet.Game.SBankKeyEvent
 - NNet.Game.SBankSignatureEvent
 - NNet.Game.SUserFinishedLoadingSyncEvent
 - NNet.Game.STriggerSoundLengthSyncEvent
 - NNet.Game.SUserOptionsEvent
 - NNet.Game.SCameraUpdateEvent
 - NNet.Game.SSelectionDeltaEvent
 - NNet.Game.SCmdEvent
 - NNet.Game.SCmdUpdateTargetPointEvent
 - NNet.Game.SCommandManagerStateEvent
 - NNet.Game.SCmdUpdateTargetUnitEvent
 - NNet.Game.SControlGroupUpdateEvent
 - NNet.Game.SHeroTalentTreeSelectedEvent
 - NNet.Game.STriggerTransmissionOffsetEvent
 - NNet.Game.STriggerTransmissionCompleteEvent
 - NNet.Game.STriggerDialogControlEvent
 - NNet.Game.STriggerSoundOffsetEvent
 - NNet.Game.SUnitClickEvent
 - NNet.Game.STriggerSoundtrackDoneEvent
 - NNet.Game.STriggerPingEvent
 - NNet.Game.STriggerCutsceneEndSceneFiredEvent
 - NNet.Game.SGameUserLeaveEvent
 - NNet.Game.SLoadingProgressMessage
 - NNet.Game.SPingMessage
 - NNet.Game.SChatMessage

## Extending the parser
It's very easy to extend the parser to do any sort of analysis upon replays that you
want. Simply write a new parser plugin and attach it.
