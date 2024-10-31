export interface ListItem {
  id: number;
  text: string;
}

export interface DynamicSizeListItem {
  key: Key;
  index: number;
  offsetTop: number;
  height: number;
}

export type Key = string | number;
