import got from 'got';
import { MockServerData } from '../shared/types/mock-server.js';
import { Command } from './command.interfaсe.js';
import { appendFile } from 'node:fs/promises';
import { TSVOfferGenerator } from '../shared/libs/offer-generator/offer-generator.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  getName(): string {
    return '--generate';
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(count: number, path: string) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    for (let i = 0; i < count; i++) {
      await appendFile(path, `${tsvOfferGenerator.generate()}\n`, {
        encoding: 'utf-8',
      });
    }
  }

  async execute(...parameters: string[]): Promise<void> {
    console.log(parameters);
    const [count, path, url] = parameters;
    const offerCount = parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(offerCount, path);
      console.info(`File ${path} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
