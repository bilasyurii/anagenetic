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
import Compare3RCommand from './commands/genome-commands/compare-3-r-command';
import CompareLessRCommand from './commands/genome-commands/compare-less-r-command';
import GetChemicalCommand from './commands/registry-commands/get-chemical-command';
import ChubiumGenerationCommand from './commands/reaction-commands/chubium-generation-command';
import DefragmentationBillaniumCommand from './commands/reaction-commands/defragmentation-billanium-command';
import DefragmentationChubiumCommand from './commands/reaction-commands/defragmentation-chubium-command';
import DigestionBillaniumCommand from './commands/reaction-commands/digestion-billanium-command';
import DigestionChubiumCommand from './commands/reaction-commands/digestion-chubium-command';
import DigestionHillagenCommand from './commands/reaction-commands/digestion-hillagen-command';
import FragmentationBillaniumCommand from './commands/reaction-commands/fragmentation-billanium-command';
import FragmentationHillagenCommand from './commands/reaction-commands/fragmentation-hillagen-command';
import PhotosynthesisCommand from './commands/reaction-commands/photosynthesis-command';

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
    const cell = this._cell;

    while (iterator.hasCurrent === true) {
      const gene = iterator.current;
      const value = gene.value;
      const command = lookup[value];

      command.execute(context);
      cell.reduceEnergy(command.energy);
    }
  }

  _initCommandContext() {
    this._context = new CommandContext(this._cell, null);
  }

  static describeGenome(iterator) {
    iterator.reset();

    const describeCommandGene = VM.describeCommandGene;

    while (iterator.hasCurrent) {
      describeCommandGene(iterator.current);
      iterator.next();
    }
  }

  static describeCommandGene(gene) {
    gene.command = VM._commandsLookup[gene.value];
  }

  static _initCommandsLookup() {
    let lookup = VM._commandsLookup;

    if (lookup !== null) {
      return;
    }

    lookup = VM._commandsLookup = [];

    const count = Gene.VARIETY;
    const commands = [
      /* 01 */ new MoveCommand,
      /* 02 */ new MoveRCommand(),
      /* 03 */ new JumpCommand(),
      /* 04 */ new EndCommand(),
      /* 05 */ new SetCommand(),
      /* 06 */ new AddCommand(),
      /* 07 */ new SubCommand(),
      /* 08 */ new EqualsRRCommand(),
      /* 09 */ new EqualsRVCommand(),
      /* 10 */ new LessRRCommand(),
      /* 11 */ new LessRVCommand(),
      /* 12 */ new GreaterRRCommand(),
      /* 13 */ new GreaterRVCommand(),
      /* 14 */ new IfCommand(),
      /* 15 */ new CopyCommand(),
      /* 16 */ new EatRCommand(),
      /* 17 */ new StoreCommand(),
      /* 18 */ new GetCommand(),
      /* 19 */ new SpreadRCommand(),
      /* 20 */ new SpreadCommand(),
      /* 21 */ new DivideCommand(),
      /* 22 */ new CheckRCommand(),
      /* 23 */ new CheckCommand(),
      /* 24 */ new DistinguishRCommand(),
      /* 25 */ new CompareRCommand(),
      /* 26 */ new Compare3RCommand(),
      /* 27 */ new CompareLessRCommand(),
      /* 28 */ new GetChemicalCommand(),
      /* 29 */ new ChubiumGenerationCommand(),
      /* 30 */ new DefragmentationBillaniumCommand(),
      /* 31 */ new DefragmentationChubiumCommand(),
      /* 32 */ new DigestionBillaniumCommand(),
      /* 33 */ new DigestionChubiumCommand(),
      /* 34 */ new DigestionHillagenCommand(),
      /* 35 */ new FragmentationBillaniumCommand(),
      /* 36 */ new FragmentationHillagenCommand(),
      /* 37 */ new PhotosynthesisCommand(),
    ];
    const knownCount = commands.length;
    const bufferSize = ((count - 1) % knownCount) + 1;
    const noop = new NoopCommand();

    for (let i = 0; i < bufferSize; ++i) {
      lookup.push(noop);
    }

    let commandIndex = 0;

    for (let i = bufferSize; i < count; ++i) {
      lookup.push(commands[commandIndex]);

      commandIndex = (commandIndex + 1) % knownCount;
    }
  }
}

VM._commandsLookup = null;
