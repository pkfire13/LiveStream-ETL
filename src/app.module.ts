import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { ManagersModule } from './managers/managers.module';
import { StreamsModule } from './streams/streams.module';

@Module({
  imports: [
    ManagersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    StreamsModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
