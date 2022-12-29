import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import mainRouter from "./routes/main.js";
import { normalize, schema } from 'normalizr';
import Mensaje from "./constructores/msjConstructor.js";
import Product from "./constructores/productsConstructor.js";
import connection from "./configdbs/MySql.js";
import randomRouter from "./routes/random.js";
import { DBConnect } from "./configdbs/mongoconfig.js";
import passport from "passport";
import * as dotenv from "dotenv";
import ParseArgs from "minimist";
import dataRouter from "./routes/dataRouter.js";
import randomNumRouter from "./routes/randomNum.js";
import cluster from "cluster";
import { cpus } from "os";

dotenv.config();

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
const userMensajes = new Mensaje("./db/mensajes.json");
const producto = new Product (connection, "products");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");


app.use(
    session({
        store:MongoStore.create({
            mongoUrl: `mongodb://${{ MONGOUSER }}:${{ MONGOPASSWORD }}@${{ MONGOHOST }}:${{ MONGOPORT }}`
            
        }),
        secret: "soysecreto",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

let mensajes = await userMensajes.getAll();
const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"});
const postSchema = new schema.Entity("post", {author: authorSchema});
const postsSchema = new schema.Entity("posts", {mensajes: [postSchema]})
const normMensajes = normalize(mensajes, postsSchema);

io.on("connection", async (socket) => {
    console.log("cliente conectado")
    const products = await producto.getAll();
    socket.emit("products", products);

    socket.on("new-product", async data => {
        await producto.save(data.title, data.price, data.thumbnail);
        const products = await producto.getAll();
        io.sockets.emit("products", products);
    })

socket.emit("mensajes", normMensajes);


socket.on("newMsj", async (data) => {
    const date = new Date().toLocaleString();
    await userMensajes.save(
        date,
        data.text,
        data.email,
        data.lastName,
        data.name,
        data.age,
        data.alias
    );

    mensajes = await userMensajes.getAll();
    const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"});
    const postSchema = new schema.Entity("post", {author: authorSchema});
    const postsSchema = new schema.Entity("posts", {mensajes: [postSchema]})
    const normMensajes = normalize(mensajes, postsSchema);

    io.sockets.emit("mensajes", normMensajes);
})
})

app.use(mainRouter);
app.use(randomRouter);
app.use(dataRouter);
app.use("/api/randoms", randomNumRouter);

const options={
    alias: {
        p: "PORT",
        m: "MODO",
    },
    default: {
        PORT: 8080,
        MODO: "fork",
    }
};

const argv = process.argv.slice(2);
const {PORT, MODO} = ParseArgs(argv, options);
const cpu = cpus().length;

if(MODO == "cluster") {
    if(cluster.isPrimary){
        console.log(`Primario: ${process.pid}`);
        for(let i = 1; i<= cpu; i++){
            cluster.fork();
        }
        cluster.on("exit", (worker) => {
            console.log(`Worker con PID ${worker.process.pid} kill`);
            cluster.fork();
        })
    } else{
        DBConnect (() => {
            const conServer = htppServer.listen(PORT, () => {
                console.log("conectado");
            });
            conServer.on("error", (error) => {
                console.log(error);
            });
        });
    }
} else{
    DBConnect (() => {
        const conServer = htppServer.listen(PORT, () => {
            console.log("conectado");
        });
        conServer.on("error", (error) => {
            console.log(error);
        });
    });
}

