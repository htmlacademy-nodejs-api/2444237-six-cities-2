type ParsedCommand = Record<string, string[]>;

export class CommandParser {
  public static parse(cliArgs: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand = "";

    for (const argument of cliArgs) {
      if (argument.startsWith("--")) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
