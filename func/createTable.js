import knex from "knex";
import connection from "./MySql.js";
const KnexMySql = new knex(connection);

KnexMySql.schema.createTable("products", (table) => {
    table.increments("id");
    table.string("title");
    table.integer("price");
    table.string("thumbnail");
} ).then (() => {
    console.log("tabla creada");
}).catch(e => console.log(e)).finally(() => KnexMySql.destroy());