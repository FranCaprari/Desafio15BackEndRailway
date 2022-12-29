import { Router } from "express";
import path from "path";

const dataRouter = new Router();

const argumentos = process.execArgv;
const plataform = process.platform;
const version = process.version;
const memory = process.memoryUsage();
const pathExe = process.execPath;
const processId = process.pid;
const ubicacion = process.cwd();

dataRouter.get("/data", (req, res) =>{
    res.render(path.join(process.cwd(), "/views/pages/data.ejs"),{
        argumentos: argumentos,
        plataform: plataform,
        version: version,
        memory: memory,
        pathExe: pathExe,
        processId: processId,
        ubicacion: ubicacion,
    });
});

export default dataRouter;