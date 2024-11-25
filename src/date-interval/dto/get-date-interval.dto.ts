import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';

export class DateIntervalPaginator extends Paginator<SalesDateInterval> {
  data: SalesDateInterval[];
}

export class GetDateIntervalsDto extends PaginationArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  is_active?: string;
}
