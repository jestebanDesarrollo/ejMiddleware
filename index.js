const express = require('express');
const app = express();
const port = process.env.PORT || 3500

let prods = [
    {
        id: 1,
        nombre: 'Producto 1',
        precio: 100
    },
    {
        id: 2,
        nombre: 'Producto 2',
        precio: 200
    },
    {
        id: 3,
        nombre: 'Producto 3',
        precio: 300
    }
]

function buscarProd(id){
    return prods.find(prod => prod.id === id);
}

//let mid = 15
let buscarProd1 = (req, res, next) => {
    if (buscarProd(parseInt(req.params.id))){
        next()
    }else{
        res.status(401).send('No autorizado por buscarProd1')
        next(new Error('No autorizado por buscadorProd1'))
    }
}

let buscarProd2 = (id) => (async (req,res, next) => {
    if(buscarProd(id)){
        next();
    } else {
        res.send({mesg:"No puede acceder a este endPoint"})
    }

})

app.use(express.urlencoded({extended: true}));

app.use(express.json());

//si el estado es verdadero activa el next mira si activa el middleware
let entrar = (req, res, next) => { 
    let estado = true;
    if(estado){
        next()
    }else{
        res.status(401).send('No autorizado')
        next(new Error('No autorizado'))
    }
}

//uso de la funcion entrar que es un middleware
app.use(entrar)

//crear un middleware con app.use
app.use((req, res, next) => {
    let number = 2
    if (number === 2){
        next();
    }else{
        res.status(401).send('No autorizado por restriccion del numero')
    }
})

app.use(async(req, res, next) => {
    let prod = await buscarProd(2)
    if(prod){
        next()
    }else{
        res.status(401).send('No autorizado')
        //next(new Error('No autorizado'))
    }
})

app.get('/',(req, res) => {
    res.send('Estamos en inicio')
});

app.get('/home', (req, res) => {
    res.send('Home')
})

app.get('/buscarprod1/:id',buscarProd1, (req, res) =>{
    res.send("Ingresado a endPoint buscarprod1")
})

let myid = 3
app.get('/buscarProd2',buscarProd2(myid),(req, res) => {
    res.send("Ingresando a endPoint buscarprod2")
})

app.listen(port, () => {
    console.log(`Servidor esta en http://localhost:${port}`)
});