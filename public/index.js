const normalize = normalizr.normalize;
const desnormalize = normalizr.desnormalize;
const schema = normalizr.schema;

const socket = io.connect();


const addProducts = document.getElementById("addProducts");
addProducts.addEventListener("submit", e =>{
    e.preventDefault();
    const title = document.getElementById("title").value;
    document.getElementById("title").value = "";
    const price = document.getElementById("price").value;
    document.getElementById("price").value = "";
    const thumbnail = document.getElementById("thumbnail").value;
    document.getElementById("thumbnail").value = "";
    socket.emit("new-product", {title: title, price: price, thumbnail: thumbnail});
});

socket.on("productos", productos => {
    makeTable(productos).then(html => {
        document.getElementById('productos'.innerHTML = html)
    })
});

const makeTable = (productos) => {
    return fetch("productos.hbs")
    .then(response => response.text())
    .then(plantilla => {
        const template = Handlebars.compile(plantilla);
        const html = template({productos})
        return html;
    })
}


const email = document.getElementById("email");
const name = document.getElementById("name");
const lastName = document.getElementById("lastName");
const age = document.getElementById("age");
const alias = document.getElementById("alias");
const mensaje = document.getElementById("mensaje");

const postMensaje = document.getElementById("postMensaje");
postMensaje.addEventListener("submit", (e)=> {
    e.preventDefault();
    const regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.value){
        email.focus();
        return (emailError.textContent = "Ingrese un email");
    } else{
        if(!regEmail.test(email.value)) {
            email.value = "";
            email.focus();
            return(emailError.textContent = "Ingrese un email valido");
        } else{
            emailError.textContent = "";
        }
    }
    if(!name.value){
        name.focus();
        return(nameError.textContent = "Ingrese un nombre");
    } else{
        name.focus();
        nameError.textContent = "";
     }
     if(!lastName.value){
        lastName.focus();
        return (lastNameError.textContent = "Ingrese apellido");
     } else{
        lastName.focus();
        lastNameError.textContent = "";
     }
     if(!age.value){
        age.focus();
        return (ageError.textContent = "Ingrese su edad");
     }else{
        age.focus()
        ageError.textContent = "";
     }
     if(!alias.value){
        alias.focus();
        return aliasError.textContent = "Ingrese su alias";
     } else{
        alias.focus();
        aliasError.textContent = "";
     }
     if(!mensaje.value){
        mensaje.focus();
        msjError.textContent = "Ingrese su mensaje";

     } else{
        mensaje.focus();
        msjError.textContent = "";
     }
     const mensaje = {
        text: mensaje.value,
        email: email.value,
        name: name.value,
        lastName: lastName.value,
        age: age.value,
        alias: alias.value,
     }
     mensaje.value="";
     mensaje.focus();
     socket.emit("newMensaje", mensaje);
})

const renderMensajes = (msj, compresion) => {
    const hmtl = msj.mensajes.map((msj) => {
        return `
                <div class="todoMsj">
                <b>${msj.author.email}</b>
                [<span>${msj.date}</span>]:
                <i>${msj.text}</i>
                </div>
                `;
    }).join(" ");
    document.getElementById("mensajes").innerHTML= html;
    document.getElementById("avg").innerHTML = compresion;
};

socket.on("mensajes", (data) => {
    const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email"});
    const postSchema = new schema.Entity("post", {
        author: authorSchema,
    });
    const postsSchema = new schema.Entity("posts", {
        mensajes: [postSchema],
    });
    const denormalizarData = denormalize(
        data.result,
        postsSchema,
        data.entities
    );

    renderMensajes(denormalizarData);

    const todoNormalizado = JSON.stringify(data).length;
    const todoDenormalizado = JSON.stringify(denormalizarData).length;
    const compresion = parseInt((todoNormalizado / todoDenormalizado)*100);

    renderMensajes(denormalizarData, comrpesion);
});