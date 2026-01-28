import { ImageSourcePropType } from 'react-native';

export interface AnimePack {
  id: string;
  title: string;
  description: string;
  author: string;
  package: string;
  image: ImageSourcePropType;
  stickers: ImageSourcePropType[];
  isAnimated?: boolean;
}
