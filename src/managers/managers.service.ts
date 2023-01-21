import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Listener } from 'src/listener/listener';
import { StreamsService } from 'src/streams/streams.service';
import { Twitch } from 'src/twitch/twitch';

@Injectable()
export class ManagersService {
  public readonly listenersMap: Map<string, Listener> = new Map();
  public readonly MAX_LISTENERS = 10;

  private readonly twitchAPI: Twitch;

  constructor(
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly streamsService: StreamsService,
  ) {
    this.twitchAPI = new Twitch(configService);
  }

  //every 15 minute, scan for new streams
  @Cron('0 */15 * * * *')
  private async scanLivestreams() {
    console.log('Scanning for new streams');
    const data = await this.twitchAPI.getStreams();
    // for each stream, check if it's in the listenersMap
    for (const stream of data) {
      if (this.listenersMap.has(stream.userId)) {
        console.log('already in listenersMap');
        continue;
      } else {
        const listener = this.createListener(stream.userId);
        if (this.addListener(stream.userId, listener)) {
          listener.start();
        }
      }
    }

    for (const [userId, listener] of this.listenersMap) {
      if (listener.onlineStatus === false) {
        //extract data from listener
        console.log(listener.getData());
        //save data to database
        const { userId, userName, maxViewers, endTimestamp } = listener.getData();
        await this.streamsService.create({
          userId: userId,
          userName: userName,
          maxViewers: maxViewers,
          endTimestamp: endTimestamp,
        })
        this.listenersMap.delete(userId);
      }
    }
  }

  public getListener(userId: string): Listener {
    return this.listenersMap.get(userId);
  }

  public addListener(userId: string, listener: Listener): boolean {
    if (this.listenersMap.size >= this.MAX_LISTENERS) {
      console.log('Max listeners reached');
      return false;
    }
    this.listenersMap.set(userId, listener);
    return true;
  }

  private createListener(userId: string): Listener {
    const listener = new Listener(
      this.schedulerRegistry,
      this.twitchAPI,
      userId,
    );
    return listener;
  }

  public startListener(userId: string): void {
    const listener = this.getListener(userId) || this.createListener(userId);
    listener.start();
    this.addListener(userId, listener);
  }

  public stopListener(userId: string): void {
    const listener = this.getListener(userId);
    if (!listener) {
      return;
    }
    listener.stop();
    this.listenersMap.delete(userId);
  }
}
