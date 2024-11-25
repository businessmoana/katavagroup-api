import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Location } from 'src/modules/location/location.entity';

export class LocationPaginator extends Paginator<Location> {
  data: Location[];
}

export class GetLocationsDto extends PaginationArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  is_active?: string;
}
