process.on("message", (message) => {
    const resultado = list_random(message);
    process.send(resultado);
});

const list_random = (cantEnv) => {
    let list = [];
    let randoms = [];

    for(let i = 1; i<= cantEnv; i++){
        const min = Math.ceil(1);
        const max = Math.floor(1000);
        const random = Math.floor(Math.random() * (max - min +1) + min);
        list.push(random);
    }
    randoms= list.reduce(
        (prev, act) => ((prev[act] = prev[act] + 1 || 1), prev),
        {}
    );
    return { randoms };
}