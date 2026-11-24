import type { Character, Room, Script } from '@takoyaki/shared';

const updatedAt = '2026-11-22T13:30:00Z';

export const sampleScript: Script = {
  id: 'sample-script',
  ownerId: 'sample-gm',
  title: '夜行的圖書館',
  coverUrl: null,
  ruleSystem: 'CoC 7e',
  playerMin: 4,
  playerMax: 6,
  sceneCount: 6,
  estimatedHoursMin: null,
  estimatedHoursMax: null,
  tags: [],
  synopsis: '一場發生在圖書館的調查。',
  status: 'completed',
  updatedAt,
};

export const sampleCharacter: Character = {
  id: 'sample-character',
  ownerId: 'sample-player',
  name: '斯卓貝瑞',
  occupation: '考古學家',
  portraitUrl: null,
  ruleSystem: sampleScript.ruleSystem,
  ruleData: {},
  tags: [],
  updatedAt,
};

export const sampleRoom: Room = {
  id: 'sample-room',
  roomCode: 'A7F3K9',
  gmId: sampleScript.ownerId,
  scriptId: sampleScript.id,
  ruleSystem: sampleScript.ruleSystem,
  maxPlayers: sampleScript.playerMax,
  scheduledAt: null,
  status: 'waiting',
  settings: {
    disallowExistingCharacters: false,
    disallowPlayerUploads: false,
    allowGmToPlayerWhispers: true,
    allowPlayerToPlayerWhispers: true,
    enableEffects: true,
  },
  members: [
    { userId: sampleScript.ownerId, characterId: null, isReady: false, isOnline: true },
    {
      userId: sampleCharacter.ownerId,
      characterId: sampleCharacter.id,
      isReady: true,
      isOnline: true,
    },
  ],
};
