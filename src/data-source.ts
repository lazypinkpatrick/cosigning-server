import { DataSource } from "typeorm";
import { Message } from "./entity/message";
import { Receiver } from "./entity/receiver";

const dbHost = process.env.PG_DATABASE_HOST
const dbName = process.env.PG_DATABASE_NAME
const dbUser = process.env.PG_DATABASE_NAME
const dbPassword = process.env.PG_DATABASE_NAME

export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: 5432,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    synchronize: true,
    logging: false,
    entities: [Message, Receiver],
    subscribers: [],
    migrations: [],
})