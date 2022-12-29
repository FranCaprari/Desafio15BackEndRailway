import fs from "fs";

class Mensaje {
    constructor(file){
        this.file = file;
    }
    async getAll(){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8");
            const mensajes = JSON.parse(data);
            return mensajes;
        }catch(e){
            console.log(e);
        }
    }
    async save(date, text, email, name, lastName, age, alias){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8");
            const dataParseada = JSON.parse(data);
            const msgId = dataParseada.mensajes.length +1;
            const newMsj = {
                id: `${msgId}`,
                date,
                text,
                author: {
                    email,
                    name,
                    lastName,
                    age,
                    alias
                },
            }
            dataParseada.mensajes.push(newMsj);
            const dataFinal = JSON.stringify(dataParseada);
            await fs.promises.writeFile(this.file, dataFinal);
        } catch(e){
            console.log(e);
        }
    }
}

export default Mensaje;