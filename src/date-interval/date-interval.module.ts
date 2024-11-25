import { Module } from '@nestjs/common';
import { DateIntervalService } from './date-interval.service';
import {
  DateIntervalController,
  ActiveDateIntervalController,
  InActiveDateIntervalController
} from './date-interval.controller';

@Module({
  controllers: [
    DateIntervalController,
    ActiveDateIntervalController,
    InActiveDateIntervalController
  ],
  providers: [DateIntervalService],
})
export class DateIntervalModule { }
