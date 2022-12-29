import { Router } from "express";
import { fork } from "child_process";

const randomNumRouter = new Router();

randomNumRouter.get("/", (req, res) => {
    const forked = fork("./func/getNums.js");
    const { cant } = req.query;
    let cantEnv;
    if(cant) {
        cantEnv= cant;
    } else{
        cantEnv = 10000;
    }
    forked.send(cantEnv);
    forked.on("mensaje", (mensaje) => {
        res.send(mensaje);
    });
});

export default randomNumRouter;