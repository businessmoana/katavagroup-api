import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Chef } from 'src/modules/chef/chef.entity';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';

export class PriceGroupPaginator extends Paginator<SifPriceGroup> {
  data: SifPriceGroup[];
}

export class GetPriceGroupsDto extends PaginationArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  is_active?: string;
}
