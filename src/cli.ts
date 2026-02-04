import { CliApplication } from './cli/cli-application.js';
import { Command } from './cli/command.interfaсe.js';
import { GenerateCommand } from './cli/generate.command.js';
import { HelpCommand } from './cli/help.command.js';
import { ImportCommand } from './cli/import.command.js';
import { VersionCommand } from './cli/version.command.js';

const commands: Record<string, Command> = {
  '--help': new HelpCommand(),
  '--version': new VersionCommand(),
  '--import': new ImportCommand(),
  '--generate': new GenerateCommand(),
};

const bootstrap = () => {
  const cliApp = new CliApplication();

  cliApp.registerCommands(Object.values(commands));

  cliApp.processParseCommand(process.argv.slice(2));
};

bootstrap();
