import * as dotenv from "dotenv";
dotenv.config();

const db_client = process.env.DB_CLIENT_SQL || "mysql2";
const db_host = process.env.DB_HOST_SQL || "containers-us-west-173.railway.app";
const db_port = Number(process.env.DB_PORT_SQL) || 6728;
const db_user = process.env.DB_USER_SQL || "root";
const db_password= process.env.DB.PASS.SQL || "qwQfjDAUsMNMO9GIBrNH";
const db_name = process.env.DB_NAME_SQL || "railway";



const connection = {
    client: `${db_client}`,
    connection: {
        host: `${db_host}`,
        port: `${db_port}`,
        user: `${db_user}`,
        password: `${db_password}`,
        database: `${db_name}`
    },
};

export default connection;