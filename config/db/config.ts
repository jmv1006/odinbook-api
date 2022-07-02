
interface IDBConfig {
    host: string,
    user: string,
    port: number | undefined,
    password: string,
    database: string
}

export const DBConfig = <IDBConfig> {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}