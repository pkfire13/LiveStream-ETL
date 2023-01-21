import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions"

const config: SqliteConnectionOptions= {
    type: "sqlite",
    database: "db.sqlite",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true, // set for development
}

export default config