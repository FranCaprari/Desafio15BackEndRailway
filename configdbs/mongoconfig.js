import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export const DBConnect = (cb) => {
    mongoose.connect(`mongodb://${{ MONGOUSER }}:${{ MONGOPASSWORD }}@${{ MONGOHOST }}:${{ MONGOPORT }}`,
    {useNewUrlParser: true},
    (error) =>{
        console.log("Conectado con exito.");
        if(error){
            console.log(error);
        }
        cb();
    }
     )
}


export const Users = mongoose.model("users", {
    username: String,
    password: String,
    email: String,
});