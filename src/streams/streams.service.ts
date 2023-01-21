import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStreamDto } from './dto/create-stream.dto';
import { Stream } from './entities/stream.entity';

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(Stream) private streamRespository: Repository<Stream>,
  ) {}
  create(createStreamDto: CreateStreamDto) {
    const newStream = this.streamRespository.create(createStreamDto);
    return this.streamRespository.save(newStream);
  }

  findAll(): Promise<Stream[]> {
    return this.streamRespository.find();
  }

  async findOne(id: number): Promise<Stream> {
    return this.streamRespository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: number) {
    const stream = await this.findOne(id);
    return this.streamRespository.remove(stream);
  }
}
