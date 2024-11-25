import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Chef } from 'src/modules/chef/chef.entity';

export class GetPaginator extends Paginator<any> {
  data: any;
}

export class GetDto extends PaginationArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  is_active?: string;
}
