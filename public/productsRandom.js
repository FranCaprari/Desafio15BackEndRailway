document.addEventListener("DOMContentLoaded", (e) =>{
    fetchData();
})

const fetchData = async() => {
    try{
        const result = await fetch("/api/products-test");
        const data = await result.json();
        renderProducts(data);
        console.log(data);
    } catch(e){
        console.log(e);
    }
}

const renderProducts = (prod) =>{
    return fetch("productos.hbs")
    .then((result) => result.text())
    .then((tabla) => {
        const template = Handlebars.compile(tabla);
        const html = template({productos});
        document.getElementById("productos").innerHTML = html;
    })
}