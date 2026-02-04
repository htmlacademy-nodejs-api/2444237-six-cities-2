import { CommandParser } from './command-parser.js';
import { Command } from './command.interfaсe.js';

type CollectionCommand = Record<string, Command>;

export class CliApplication {
  constructor(private readonly defaultCommand: string = '--help') {}
  private commands: CollectionCommand = {};

  public registerCommands(commandList: Command[]) {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(command: string): Command {
    return this.commands[command] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command {
    if (!this.defaultCommand) {
      throw new Error('Default command is not defined');
    }
    return this.commands[this.defaultCommand];
  }

  public processParseCommand(args: string[]) {
    const parsedArguments = CommandParser.parse(args);
    if (Object.keys(parsedArguments).length === 0) {
      const command = this.getDefaultCommand();
      command.execute();
      return;
    }

    const [commandName] = Object.keys(parsedArguments);
    const command = this.getCommand(commandName);
    const commandArguments = parsedArguments[commandName];
    command.execute(...commandArguments);
  }
}
