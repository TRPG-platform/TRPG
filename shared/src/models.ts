/** ISO 8601 timestamp. */
type IsoTimestamp = string;

export interface User {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: IsoTimestamp;
}

export interface Script {
  id: string;
  ownerId: string;
  title: string;
  coverUrl: string | null;
  ruleSystem: string;
  playerMin: number;
  playerMax: number;
  sceneCount: number;
  estimatedHoursMin: number | null;
  estimatedHoursMax: number | null;
  tags: string[];
  synopsis: string;
  status: 'draft' | 'in-progress' | 'completed';
  updatedAt: IsoTimestamp;
}

export interface Character {
  id: string;
  ownerId: string;
  name: string;
  occupation: string;
  portraitUrl: string | null;
  ruleSystem: string;
  /** The selected rule system defines this payload, including HP, SAN, attributes, and skills. */
  ruleData: Record<string, unknown>;
  tags: string[];
  updatedAt: IsoTimestamp;
}

interface RoomSettings {
  disallowExistingCharacters: boolean;
  disallowPlayerUploads: boolean;
  allowGmToPlayerWhispers: boolean;
  allowPlayerToPlayerWhispers: boolean;
  enableEffects: boolean;
}

interface RoomMember {
  userId: string;
  characterId: string | null;
  isReady: boolean;
  isOnline: boolean;
}

export interface Room {
  id: string;
  /** Six characters using only uppercase ASCII letters and digits. */
  roomCode: string;
  gmId: string;
  scriptId: string;
  ruleSystem: string;
  maxPlayers: number;
  scheduledAt: IsoTimestamp | null;
  status: 'waiting' | 'playing' | 'ended';
  settings: RoomSettings;
  members: RoomMember[];
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  channel: 'main' | 'whisper' | 'gm-notice' | 'dice';
  /** Empty for public messages. */
  recipientIds: string[];
  body: string;
  createdAt: IsoTimestamp;
  editedAt: IsoTimestamp | null;
  deleted: boolean;
}
