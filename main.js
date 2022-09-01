const express = require('express');
const app = express();
const Contenedor = require('./index.js');
const contenedor = new Contenedor('./productos.json');


app.set("port", 8080);


app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get("/products", async (req, res) => {
    let data = await contenedor.getAll();
    res.send(data);
});

app.get("/randomProduct", async(req, res) => {
    let randomNum = Math.floor(Math.random() * 10);
    let data = await contenedor.getById(randomNum);
    if(data === null){
        res.send("ERROR, NO EXISTE EL PRODUCTO");
    } else{
        res.json(data);
    }
});

const server = app.listen(app.get("port"), () => {
    console.log(`Servidor funcionando`);
});

