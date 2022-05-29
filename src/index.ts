import express from "express";
import { AppDataSource } from "./data-source";
import 'reflect-metadata'
import { Message } from "./entity/message";
import { Receiver } from "./entity/receiver";
import { In, LessThan } from "typeorm";

AppDataSource.initialize().then((dataSource) => {
    const messageRepository = dataSource.getRepository(Message)
    const receiverRepository = dataSource.getRepository(Receiver)
// define a route handler for the default home page
    const app = express();
    const port = 8080; // default port to listen
    app.use(express.json());

    app.post("/put", async (req, res) => {
        // render the index template
        const entity = {
            sender: req.body.sender,
            body: req.body.message,
        }
        const message = await messageRepository.save(entity)
        for(const receiver of req.body.receiver) {
            const receiverEntity = {
                owner: receiver,
                message
            }
            await receiverRepository.save(receiverEntity)
        }
        return res.send(`{"status": "success", "id": ${message.id}}`);
    });

    app.get("/get", async (req, res) => {
        // render the index template
        const receivers = await receiverRepository.find({
            relations: ['message'],
            where: {
                owner: 'user1'
            }
        })
        const result = receivers.map(item => ({
            sender: item.message.sender,
            id: item.message.id,
            message: item.message.body
        }))
        return res.send(result);
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
            receiverRepository.find({
                where: {
                    message: In(messages)
                }
            }).then(receivers => {
                receiverRepository.remove(receivers).then(() => {
                    messageRepository.remove(messages).then(() => setTimeout(() => null))
                })
            })
        })
    }, 1000)
})
