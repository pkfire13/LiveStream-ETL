import { SchedulerRegistry } from '@nestjs/schedule';
import { Twitch } from 'src/twitch/twitch';

interface ListenerData {
  userId: string;
  userName: string;
  startTimestamp: Date;
  endTimestamp: Date;
  maxViewers: number;
}

export class Listener {
  private FIFTEEN_MINUTES = 15 * 60 * 1000;

  public onlineStatus: boolean;

  private startTimestamp: Date;
  private endTimestamp: Date;
  private maxViewers: number;
  private userName: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private twitchAPI: Twitch,
    private readonly userId: string,
  ) {
    console.log('Listener instantiated');
    this.maxViewers = 0
  }

  public start(): void {
    console.log('Listener started');
    this.onlineStatus = true;
    this.startTimestamp = new Date();

    const interval = setInterval(() => {
      this.listen();
    }, this.FIFTEEN_MINUTES);
    this.schedulerRegistry.addInterval(this.userId, interval);
  }

  private async listen() {
    // get data from Twitch API
    const { userId, type, userName, viewerCount } =
      (await this.twitchAPI.getLivestreamInfo(this.userId)) ?? {};

    if (type != 'live') {
      console.log('Stream is offline');
      this.stop();
      return;
    } else {
      this.userName = userName;
      this.maxViewers = Math.max(viewerCount, this.maxViewers);
      console.log('max', this.maxViewers)
    }
  }

  public stop(): void {
    if (!this.onlineStatus) {
      return;
    }
    console.log('Listener stopped');
    const interval = this.schedulerRegistry.getInterval(this.userId);
    clearInterval(interval);
    this.endTimestamp = new Date();
    this.onlineStatus = false;
  }

  public getData(): ListenerData {
    return {
      userId: this.userId,
      userName: this.userName,
      startTimestamp: this.startTimestamp,
      endTimestamp: this.endTimestamp,
      maxViewers: this.maxViewers,
    };
  }
}
