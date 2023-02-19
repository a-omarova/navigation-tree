export type PageType = {
  id: string;
  title: string;
  url?: string;
  level: number;
  parentId?: string;
  pages?: string[];
  anchors?: string[];
  tabIndex: number;
  disqus_id?: string;
}
export interface PagesType {
  [arg: string]: PageType
}

export type AnchorType = {
  parentId: string;
  id: string;
  title: string;
  url: string;
  anchor: string
  level: number;
  disqus_id: string;
}
export interface AnchorsType {
  [arg: string]: AnchorType
}

export type EntitiesType = {
  pages: PagesType;
  anchors: AnchorsType;
}

export type DataType = {
  entities: EntitiesType;
  topLevelIds: string[];
}
