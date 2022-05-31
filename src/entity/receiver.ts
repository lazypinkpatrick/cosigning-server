import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from "typeorm";
import { Message } from "./message";

@Entity()
export class Receiver {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: string;

    @ManyToOne(() => Message, (message) => message.receivers, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    message: Message
}