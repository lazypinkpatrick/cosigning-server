import { DataSource } from "typeorm";
import { Message } from "./entity/message";
import { Receiver } from "./entity/receiver";
import { config } from "dotenv";

config()
const dbHost = process.env.PG_DATABASE_HOST
const dbName = process.env.PG_DATABASE_NAME
const dbUser = process.env.PG_DATABASE_USER
const dbPassword = process.env.PG_DATABASE_PASSWORD

export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: 5432,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    synchronize: true,
    logging: 'all',
    entities: [Message, Receiver],
    subscribers: [],
    migrations: [],
})