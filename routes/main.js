import {Router} from 'express';
const mainRouter = new Router;


mainRouter.get("/", (req, res) => {
    const nombre = req.session?.nombre;
    if(nombre) {
        res.render("pages/main.ejs", {nombre });

    } else{
        res.redirect("/login");
    }
});

mainRouter.get("/login", (req, res) => {
    const nombre = req.session?.nombre;
    if (nombre) {
        res.redirect("/");
    } else{
        res.render("pages/login");
    }
});

mainRouter.get("/logout", (req, res) => {
    const nombre = req.session?.nombre;
    if(nombre){
        req.session.destroy((err) => {
            if(!err){
                res.render("pages/logout.ejs", { nombre });
            } else{
                res.redirect("/");
            }
        });
    } else{
        res.redirect("/");
    }
});

mainRouter.post("/login", (req, res) => {
    req.session.nombre = req.body.nombre;
    res.redirect("/");
});
export default mainRouter;