import { readFileSync, writeFileSync } from 'fs';

export interface Config {
  volume: number;
  chapter: number;
  step: number;
  room: string;
}

export const config: Config = JSON.parse(readFileSync('./config.json','utf-8'));

export function writeConfig(){
    writeFileSync('./config.json', JSON.stringify(config,null,2));
}