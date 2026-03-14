import { DataSourceOptions } from "typeorm";
import { envs } from "../../config/envs";
import { DataSource } from "typeorm";
import { LostPet } from "../entities/lost-pet.entity";
import { FoundPet } from "../entities/found-pet.entity";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    type: 'postgres',
    entities: [LostPet, FoundPet],
    synchronize: false,
    migrations: ["dist/core/db/migrations/*"] //El lugar donde se encuentran mis migraciones pero en JS
}

export const dataSource = new DataSource(dataSourceOptions);
