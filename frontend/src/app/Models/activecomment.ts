import { ActiveCommentTypeEnum } from './activeCommentType.enum';

export interface ActiveComment {
  id: string;
  type: ActiveCommentTypeEnum;
}
