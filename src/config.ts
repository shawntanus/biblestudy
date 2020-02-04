import { parse, stringify } from 'ini';
import { readFileSync, writeFileSync } from 'fs';

export const config = parse(readFileSync('./config.ini', 'utf-8'));
export default config;

export function writeConfig(){
    writeFileSync('./config.ini', stringify(config));
}


