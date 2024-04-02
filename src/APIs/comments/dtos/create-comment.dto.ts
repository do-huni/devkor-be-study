import { OmitType } from '@nestjs/swagger';

export class CreateCommentDto {
  boardId: number;
  content: string;
  parentId?: number;
  id?: number;
  email: string;
}

export class CreateCommentInput extends OmitType(CreateCommentDto, ['email']) {}
