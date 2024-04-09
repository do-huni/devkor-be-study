import { IsEnum } from 'class-validator';
import { FilterOption } from 'src/common/enums/filter-option';
import { PageRequest } from 'src/utils/page/page-request';

export class FetchPostsDto extends PageRequest {
  @IsEnum(FilterOption)
  filter: FilterOption = FilterOption.DATE;

  search: string = '%';
}
