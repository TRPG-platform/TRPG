import type { AttributeKey } from './types.js';

// 職業清單：只放職業名稱與職業點數公式（數值），
// 不放規則書的本職技能清單、信用範圍與說明文字（開發注意事項第 2 節）。
// 公式：EDU × 2 ＋ （bestOf 中最高的屬性）× 2；bestOf 為空時是 EDU × 4。

export interface OccupationDefinition {
  name: string;
  bestOf: AttributeKey[];
}

const o = (name: string, ...bestOf: AttributeKey[]): OccupationDefinition => ({ name, bestOf });

export const OCCUPATIONS: OccupationDefinition[] = [
  o('會計師'),
  o('古董商'),
  o('考古學家'),
  o('建築師'),
  o('藝術家', 'DEX', 'POW'),
  o('運動員', 'DEX', 'STR'),
  o('作家'),
  o('小說家'),
  o('書商'),
  o('神職人員'),
  o('修女'),
  o('電腦工程師'),
  o('駭客'),
  o('詐欺師', 'APP'),
  o('醫生'),
  o('護士'),
  o('編輯'),
  o('工程師'),
  o('藝人', 'APP'),
  o('探險家', 'APP', 'DEX', 'STR'),
  o('農夫', 'DEX', 'STR'),
  o('消防隊員', 'DEX', 'STR'),
  o('法醫'),
  o('律師'),
  o('法官'),
  o('圖書館員'),
  o('技工'),
  o('軍官', 'DEX', 'STR'),
  o('士兵', 'DEX', 'STR'),
  o('傭兵', 'DEX', 'STR'),
  o('博物館館長'),
  o('音樂家', 'APP', 'DEX'),
  o('神祕學家'),
  o('藥劑師'),
  o('攝影師'),
  o('飛行員', 'DEX'),
  o('警探', 'DEX', 'STR'),
  o('警察', 'DEX', 'STR'),
  o('私家偵探', 'DEX', 'STR'),
  o('教授'),
  o('心理學家'),
  o('新聞記者'),
  o('科學家'),
  o('秘書', 'DEX', 'APP'),
  o('店主', 'APP', 'DEX'),
  o('計程車司機', 'DEX'),
  o('學生'),
];

export function findOccupation(name: string): OccupationDefinition | undefined {
  return OCCUPATIONS.find((occupation) => occupation.name === name.trim());
}
