import sqlite from 'sqlite';
import { config, writeConfig } from './config';
import { tify } from 'chinese-conv';
import { Wechaty, Room } from 'wechaty';

let room: Room|null = null;

export async function sendBible() {
    console.log('sending chapter');
    if (!room) {
      console.log('room is not ready yet');
      return;
    }

    let i = 0;
    do {
      const chapter = await getChapter(config.volume, config.chapter);
      if (chapter) {
        console.log(`sending volume: ${config.volume}, chapter: ${config.chapter}`);
        await room.say(chapter);
        config.chapter++;
        i++;
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        config.volume++;
        config.chapter = 1;
      }
    } while (i < config.step);

    writeConfig();
}

export async function checkRoom(bot: Wechaty) {
  if (!room) {
    const searchRegex = new RegExp(config.room);
    console.log("search for:", searchRegex);
    room = await bot.Room.find({ topic: searchRegex });

    if (!room) {
      console.log('room not found');
    } else {
      console.log(await room.topic(), 'found');
      console.log(room.id);
    }
    room?.announce();
    
    console.log(`Current volume: ${config.volume}, chapter: ${config.chapter}`);
  }
}

export async function getChapter(volume: number, chapter: number) {
  const db = await sqlite.open('./bible.db');
  const { FullName } = await db.get(`SELECT FullName FROM BibleID WHERE SN=${volume}`);
  const title = `${FullName} - 第${chapter}章 \n`;
  const lections = await db.all(`SELECT Lection from Bible WHERE VolumeSN=${volume} and ChapterSN=${chapter}`);

  if (lections.length > 0) {
    const string = title + lections.map((l) => l.Lection.trim().replace('\u3000', '')).join();
    return tify(string);
  }
  return null;
}
