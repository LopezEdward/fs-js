import { DataSource } from "typeorm";
import { Seller } from "../entity/Seller";
import { District } from "../entity/District";
import "reflect-metadata";

const AppDataSource = await new DataSource({
    type: "postgres",
    host: import.meta.env.PG_HOST,
    port: import.meta.env.PG_PORT,
    username: import.meta.env.PG_USERNAME,
    password: import.meta.env.PG_PASSWORD,
    database: import.meta.env.PG_DB_NAME,
    poolSize: import.meta.env.PG_MAX_CONN || 10,
    entities: [Seller, District],
    synchronize: true,
    logger: "debug"
}).initialize();

export {
    AppDataSource
}