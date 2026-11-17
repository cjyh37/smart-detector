import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, '.site-public');
const config = JSON.parse(await readFile(join(root, 'download.json'), 'utf8'));
if (!config.available || config.channel !== 'google-play' || config.url !== 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector') {
  throw new Error('The public download must point to the released Google Play app.');
}
await mkdir(output, { recursive: true });
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });
await writeFile(join(output, '.nojekyll'), '');
await writeFile(join(output, 'download.json'), JSON.stringify(config, null, 2) + '\n');
