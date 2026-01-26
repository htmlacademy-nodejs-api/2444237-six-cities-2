import { Command } from './command.interfaсe.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageJsonConfig = {
  version: string;
};

const isPackageJsonConfig = (value: unknown): value is PackageJsonConfig => (
  typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
);

export class VersionCommand implements Command {
  constructor(private filePath: string = './package.json') {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJsonConfig(importedContent)) {
      throw new Error('Failed to read package.json');
    }

    return importedContent.version;
  }

  getName(): string {
    return '--version';
  }

  execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.log(version);
    } catch (error) {
      throw new Error('The file package.json does not exist');
    }
  }
}
