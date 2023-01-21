import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Stream {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    userName: string;

    @Column()
    maxViewers: number;

    @Column()
    endTimestamp: Date;
}
