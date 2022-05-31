import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Receiver } from "./receiver";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender: string;

    @Column()
    body: string;

    @Column()
    type: string;

    @CreateDateColumn()
    create: Date;

    @OneToMany(() => Receiver, (receiver) => receiver.message, )
    receivers: Receiver[]
}
