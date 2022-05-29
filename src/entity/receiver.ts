import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Message } from "./message";

@Entity()
export class Receiver {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: string;

    @ManyToOne(() => Message, (message) => message.receivers, {
        cascade: true
    })
    @JoinColumn()
    message: Message
}