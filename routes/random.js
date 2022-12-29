import { Router } from 'express';
const randomRouter = new Router;
import { faker } from "@faker-js/faker";

const {commerce, image} = faker;

let listaProd = [];

const generarProduct = () => {
    return {
        title: commerce.productName(),
        price: commerce.price(),
        thumbnail: image.business(600, 400, true),
    };
}

randomRouter.get("/api/productos-test", (req, res) => {
    for(let i = 1; i<=5; i++){
        listaProd.push({id: listaProd.length+1, ...generarProduct()});
    }
    res.send(listaProd);
    listaProd= [];
})

export default randomRouter;