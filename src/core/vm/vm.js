import Gene from '../genome/gene';
import CommandContext from './command-context';
import AddCommand from './commands/arithmetic/add-command';
import SubCommand from './commands/arithmetic/sub-command';
import EqualsRRCommand from './commands/conditional/equals-rr-command';
import EqualsRVCommand from './commands/conditional/equals-rv-command';
import EndCommand from './commands/control-commands/end-command';
import JumpCommand from './commands/control-commands/jump-command';
import NoopCommand from './commands/control-commands/noop-command';
import MoveCommand from './commands/cell-commands/move-command';
import MoveRCommand from './commands/cell-commands/move-r-command';
import SetCommand from './commands/registry-commands/set-command';
import CopyCommand from './commands/registry-commands/copy-command';
import LessRRCommand from './commands/conditional/less-rr-command';
import LessRVCommand from './commands/conditional/less-rv-command';
import GreaterRRCommand from './commands/conditional/greater-rr-command';
import GreaterRVCommand from './commands/conditional/greater-rv-command';
import IfCommand from './commands/conditional/if-command';
import EatRCommand from './commands/cell-commands/eat-r-command';
import StoreCommand from './commands/registry-commands/store-command';
import GetCommand from './commands/registry-commands/get-command';
import SpreadRCommand from './commands/cell-commands/spread-r-command';
import SpreadCommand from './commands/cell-commands/spread-command';
import DivideCommand from './commands/cell-commands/divide-command';
import CheckRCommand from './commands/vision-commands/check-r-command';
import CheckCommand from './commands/vision-commands/check-command';
import DistinguishRCommand from './commands/vision-commands/distinguish-r-command';
import CompareRCommand from './commands/genome-commands/compare-r-command';

export default class VM {
  constructor(cell) {
    this._cell = cell;

    this._cursor = 0;

    this._genome = null;
    this._genomeIterator = null;
    this._context = null;

    this._initCommandContext();

    VM._initCommandsLookup();
  }

  set genome(value) {
    this._genome = value;

    const iterator = value.iterator;

    this._genomeIterator = iterator;
    this._context.iterator = iterator;
  }

  execute() {
    const iterator = this._genomeIterator.reset();
    const lookup = VM._commandsLookup;
    const context = this._context;

    while (iterator.hasNext === true) {
      const gene = iterator.current;
      const value = gene.value;
      const command = lookup[value];

      command.execute(context);
    }
  }

  _initCommandContext() {
    this._context = new CommandContext(this._cell, null);
  }

  static _initCommandsLookup() {
    let lookup = VM._commandsLookup;

    if (lookup !== null) {
      return;
    }

    lookup = VM._commandsLookup = [
      NoopCommand,
    ];

    const count = Gene.VARIETY;
    const commands = [
      /* 01 */ MoveCommand,
      /* 02 */ MoveRCommand,
      /* 03 */ JumpCommand,
      /* 04 */ EndCommand,
      /* 05 */ SetCommand,
      /* 06 */ AddCommand,
      /* 07 */ SubCommand,
      /* 08 */ EqualsRRCommand,
      /* 09 */ EqualsRVCommand,
      /* 10 */ LessRRCommand,
      /* 11 */ LessRVCommand,
      /* 12 */ GreaterRRCommand,
      /* 13 */ GreaterRVCommand,
      /* 14 */ IfCommand,
      /* 15 */ CopyCommand,
      /* 16 */ EatRCommand,
      /* 17 */ StoreCommand,
      /* 18 */ GetCommand,
      /* 19 */ SpreadRCommand,
      /* 20 */ SpreadCommand,
      /* 21 */ DivideCommand,
      /* 22 */ CheckRCommand,
      /* 23 */ CheckCommand,
      /* 24 */ DistinguishRCommand,
      /* 25 */ CompareRCommand,
    ];
    const knownCount = commands.length;
    const bufferSize = count % knownCount;

    for (let i = 0; i < bufferSize; ++i) {
      lookup.push(NoopCommand);
    }

    let commandIndex = 0;

    for (let i = bufferSize; i < count; ++i) {
      lookup.push(commands[commandIndex]);

      commandIndex = (commandIndex + 1) % knownCount;
    }
  }
}

VM._commandsLookup = null;
