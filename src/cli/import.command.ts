import { getErrorMessage } from '../shared/helpers/common.js';
import { createOffer } from '../shared/helpers/offer.js';
import { TSVFileReader } from '../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interfaсe.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onCompletedImport(count: number) {
    console.log(`Imported ${count} offers`);
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompletedImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }
}
