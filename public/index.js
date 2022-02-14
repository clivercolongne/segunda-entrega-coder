let productos = []

const ISADMIN = true

//Me traigo los productos con Fetch
function fetchProducts() {
    fetch('/api/productos')
    .then( response => response.json())
    .then(data => {
        productos=data
        renderList(productos)
    })
}

function renderList(data) {
    data.forEach(function(producto){
        $("#list").append(
            `
            <div class="d-inline-flex p-2" >
                <div class="card" style="width: 15rem;">
                    <img src="${producto.foto}" style="height:18rem;" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text">Codigo: ${producto.codigo}</p>
                        <p class="card-text">Precio: ${producto.precio}</p>
                        <p class="card-text">Stock: ${producto.stock}</p>
                        <span class="modifyButtons">
                            <button onclick="modifyProduct(${producto.id})" class="btn btn-primary">Actualizar</button>
                            <button onclick="deleteProduct(${producto.id})" class="btn btn-danger">Eliminar</button>
                        </span>
                    </div>
                </div>
            </div>
            `
        )
    })

    if(!ISADMIN){
        $(".modifyButtons").html("")
    }
}

function modifyProduct(id){
    let producto = []
    
    //Me traigo los valores actuales del producto a modificar
    fetch('/api/productos/'+id)
    .then( response => response.json())
    .then(data => {
        producto=data

        //Con los valores de producto recuperados, llenamos la tabla de modificacion
        $("#formNombre").val(producto.nombre)
        $("#formDescripcion").val(producto.descripcion)
        $("#formCodigo").val(producto.codigo)
        $("#formFoto").val(producto.foto)
        $("#formPrecio").val(producto.precio)
        $("#formStock").val(producto.stock)

        $("#formBotonModificar").html(
            `
                <button onclick="sendPut(${id})" class="btn btn-warning" value="Modificar">Modificar</button>
                <button onclick="cancelButton()" class="btn btn-danger" value="Modificar">Cancelar</button>
            `)
        
        $("#formBotonModificar").get(0).scrollIntoView()
    })

}

function deleteProduct(id) {
    console.log(id)
    console.log(JSON.stringify(null))
    multiusageFetch(id, "DELETE", null, "Borrado exitoso.")
}

function sendPut(id){
    console.log(id)

    const data = getFormData(null)

    multiusageFetch(id, "PUT", data, "Modificacion exitosa.")
 
}

function sendPost() {
    const data = getFormData()

    console.log(data)

    multiusageFetch(null, "POST", data, "Nuevo objeto creado satisfactoriamente.")

}


function getFormData(id) {
    //Obtenemos la data del form en formato JSON
    var formData = $('form').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    const data = {...formData,
        id:id,
        timestamp:Date.now()
    }

    return data
}


function multiusageFetch(id, method, data, successMessage) {
    let path = ""
    let body = ""

    if(id==null){
        path = '/api/productos'
    }else{
        path = '/api/productos/'+id
    }

    if(data==null){
        body=""
    }else{
        body=JSON.stringify(data)
    }

    fetch(path, {
        method:method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then( () => {
        window.alert(successMessage)
        window.location.reload()
    })
    .catch(err => {
        console.log(err)   
    })
}

function cancelButton(){
    $("#formNombre").val("")
    $("#formDescripcion").val("")
    $("#formCodigo").val("")
    $("#formFoto").val("")
    $("#formPrecio").val("")
    $("#formStock").val("")

    $("#formBotonModificar").html("")
}


//Llenamos la lista con este proceso
fetchProducts()