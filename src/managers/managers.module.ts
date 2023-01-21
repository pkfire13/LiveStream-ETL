import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { StreamsModule } from "src/streams/streams.module";

@Module({
  imports:[ConfigModule.forRoot({
    envFilePath: '.env',
  }), ScheduleModule.forRoot(), StreamsModule ],
  controllers: [ManagersController],
  providers: [ManagersService]
})
export class ManagersModule {}
