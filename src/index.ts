import express from "express";
import { AppDataSource } from "./data-source";
import 'reflect-metadata'
import { Message } from "./entity/message";
import { Receiver } from "./entity/receiver";
import cors from 'cors';
import { In, LessThan, MoreThan } from "typeorm";
import { cat } from "shelljs";

AppDataSource.initialize().then((dataSource) => {
    const messageRepository = dataSource.getRepository(Message)
    const receiverRepository = dataSource.getRepository(Receiver)
// define a route handler for the default home page
    const app = express();
    const port = 8080; // default port to listen
    app.use(express.json());
    app.use(cors({origin: '*'}))

    app.post("/put", async (req, res) => {
        // render the index template
        try {
            const entity = {
                sender: req.body.sender,
                body: req.body.message,
                type: req.body.type ? req.body.type : 'no-type',
            }
            const message = await messageRepository.save(entity)
            for (const receiver of req.body.receiver) {
                const receiverEntity = {
                    owner: receiver,
                    message
                }
                await receiverRepository.save(receiverEntity)
            }
            return res.send(`{"status": "success", "id": ${message.id}}`);
        } catch (e) {
            console.log(e)
        }
    });

    app.get("/get", async (req, res) => {
        try {
            // render the index template
            const user: string = req.query.user as string
            const idStr = req.query.id as string
            const id = isNaN(Number(idStr)) ? 0 : Number(idStr)
            const type = req.query.type as string
            const messages = await receiverRepository.createQueryBuilder()
                .select('Message.id', 'MessageId')
                .addSelect('Message.sender', 'MessageSender')
                .addSelect('Message.type', 'MessageType')
                .addSelect('Message.body', 'MessageBody')
                .innerJoin('message', 'Message', 'Receiver.messageId = Message.id')
                .where('owner=:owner', {owner: user})
                .andWhere('Message.id > :id', {id: id})
                .andWhere('Message.type=:type', {type: type})
                .getRawMany()
            const result = messages.map(item => ({
                sender: item.MessageSender,
                id: item.MessageId,
                message: item.MessageBody,
                type: item.MessageType
            }))
            return res.send(result);
        } catch (e) {
            console.log(e)
        }
    });

// start the express server
    app.listen(port, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${port}`);
    });

    setInterval(() => {
        const date = new Date((new Date()).getTime() - 10 * 60000);
        messageRepository.find({
            where: {
                create: LessThan(date)
            }
        }).then(messages => {
            messageRepository.remove(messages).then(() => null)
        })
    }, 10000)
})
