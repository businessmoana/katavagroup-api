import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Orders } from 'src/modules/orders/orders.entity';

export class ChefsOrdersPaginator extends Paginator<Orders> {
  data: Orders[];
}

export class GetChefsOrdersDto extends PaginationArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
}
