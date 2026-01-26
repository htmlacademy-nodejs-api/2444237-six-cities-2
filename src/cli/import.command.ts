import { TSVFileReader } from '../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interfaсe.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      console.error(error);
    }
  }
}
