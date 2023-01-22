import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

export async function AppVersion() {
  try {
    const version = await readFile(join(__dirname, 'version'), 'utf8');
    Logger.log(`Application version: ${version}`);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      Logger.error(`Application version: ${ex}`);
    } else {
      Logger.warn(`Application version: unknown`);
    }
  }
}
