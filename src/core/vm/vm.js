import Gene from '../genome/gene';
import CommandContext from './command-context';
import AddCommand from './commands/add-command';
import EndCommand from './commands/end-command';
import JumpCommand from './commands/jump-command';
import MoveCommand from './commands/move-command';
import NoopCommand from './commands/noop-command';
import SetCommand from './commands/set-command';

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

      break;
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
      MoveCommand,
      JumpCommand,
      EndCommand,
      SetCommand,
      AddCommand,
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
