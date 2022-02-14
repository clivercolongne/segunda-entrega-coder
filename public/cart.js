let carritos = []
let productos = []

async function fetchAndRenderCarritos() {

    await fetch('/api/carrito')
        .then( response => response.json())
        .then( carts => {
            carritos = carts
        })
    
    await fetch('/api/productos')
        .then( response => response.json())
        .then( products => {
            productos = products
    })   

    //Llenamos la pagina de carritos
    carritos.forEach(carrito => {

        $("#carritos").append(
            `
                <div class="alert alert-primary" role="alert">
                    Carrito # ${carrito.id}, Creado en ${Date(carrito.timestamp)}

                    <button onclick="deleteCart(${carrito.id})" class="btn btn-danger" value="crear">Eliminar Carrito</button>
                </div>

                <div class="container-flex">
                <div id="productosCart${carrito.id}"> </div>
                
            `
        )
    
        
        //Para cada carrito, llenamos sus productos
        carrito.productos.forEach(function(obj) {
            let item = productos.find(prod => prod.id == obj.id)

            $("#productosCart"+carrito.id).append(
                `
                    <div class="d-inline-flex p-2" >
                    <div class="card" style="width: 15rem;">
                        <img src="${item.foto}" style="height:18rem;" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${item.nombre}</h5>
                            <p class="card-text">${item.descripcion}</p>
                            <p class="card-text">Codigo: ${item.codigo}</p>
                            <p class="card-text">Precio: ${item.precio}</p>
                            <p class="card-text">Cantidad: ${obj.cantidad}</p>
                            <p class="card-text">Stock: ${item.stock}</p>
                            <button onclick="deleteProductFromCart(${carrito.id}, ${item.id})" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>
                    </div>
                `
            )
        })

    })
            
}

function addToCart(){
    const idCart = $("#idCarrito").val()
    const idProd = $("#idProducto").val()
    const cantidadProd = $("#cantidadProducto").val()

    const productoAgregado = {
        id: idProd,
        cantidad: cantidadProd
    }

    multiusageFetch(idCart, "POST", productoAgregado, "Objeto anadido exitosamente al carrito.")

}

function deleteProductFromCart(idCart, idProd){

    multiusageFetch(idCart, "DELETE", null, "Objeto eliminado exitosamente del carrito", idProd)
}

function deleteCart(idCart){
    multiusageFetch(idCart, "DELETE", null, "Carrito eliminado exitosamente.", null)
}

function createCart(){
    multiusageFetch(null, "POST", null, "Carrito creado exitosamente.", null)
}

function multiusageFetch(idCart, method, obj, successMessage, idProd) {
    let body = ""
    let path = ""

    if(idProd==null){
        path = '/api/carrito/'+idCart+'/productos'
    }else{
        path = '/api/carrito/'+idCart+'/productos/'+idProd
    }

    if((obj==null) && (idProd==null)) {
        path = '/api/carrito/'+idCart
    }

    if(obj==null){
        body=""
    }else{
        body=JSON.stringify(obj)
    }

    if(idCart==null) {
        path= '/api/carrito'
    }


    fetch(path, {
        method:method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => response.text())
    .then(data => {
        const errorMessage = JSON.parse(data).error

        if(errorMessage == undefined) {
            window.alert(successMessage)
            window.location.reload()
        }

        if (errorMessage.length > 0) {
            window.alert(errorMessage)
        } 

    })
    
    .catch(err => {
        console.log(`Ocurrio un error: ${err}`)   
    })

}

 fetchAndRenderCarritos()