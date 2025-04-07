window.addEventListener('load', () => {
    renderProductosEnCarrito();
});

function renderProductosEnCarrito(){
    let divCarroProductos = document.querySelector('.carro-productos');
    let msjCarroVacio = document.querySelector('.carro-vacio');
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if(!carrito || carrito.length == 0){
        divCarroProductos.style.display = 'none';
        msjCarroVacio.style.display = 'block';
        return renderCountCarrito();
    }

    let html = '';
    let precioTotal = 0;
    carrito.forEach(producto => {
        precioTotal += producto.cantidad * producto.precio;
        html += 
            `<div class="card">
                <img src="./img/producto-${producto.id}.png" width="60" height="60"/>
                <div>
                    <span class="title">${producto.nombre}</span>
                    <div class="cantidad">
                        <span>Cantidad: </span>
                        <button class="btn-decrementar" onclick="decrementar('${producto.id}')">
                            <span>-</span>
                        </button>
                        <input type="text" value=${producto.cantidad} id="cantidad-${producto.id}"/>
                        <button class="btn-aumentar" onclick="incrementar('${producto.id}')">
                            <span>+</span>
                        </button>
                        <span class="precio">Precio: $${parseFloat(producto.cantidad * producto.precio).toFixed(3)}</span>
                    </div>
                </div>
                <i class="fa-solid fa-trash" onclick="quitarProducto('${producto.id}')"></i>
            </div>`;
    });

    html += `<span> Precio Total: $${parseFloat(precioTotal).toFixed(3)}</span>`;
    divCarroProductos.innerHTML = html;
    return renderCountCarrito(); 
}

function quitarProducto(id=null){
    if(!id) return;
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if(!carrito) return;
    carrito = carrito.filter( (p) => p.id != id);
    localStorage.setItem('carrito',JSON.stringify(carrito));
    return renderProductosEnCarrito();         
}

function renderCountCarrito(){
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let count = 0;
    let msjCarroVacio = document.querySelector('.carro-vacio');
    let countCarrito = document.querySelector('#countCarrito');
    if(!carrito){
        msjCarroVacio.style.display = 'block';
        return countCarrito.innerHTML = count; 
    }
    for(let producto of carrito){
        count += producto.cantidad;
    }
    return $('#countCarrito').html(count);      
}

function incrementar(id){
    let inputCantidad = document.querySelector('#cantidad-'+id);
    inputCantidad.value = parseInt(inputCantidad.value) + 1;
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito = carrito.map( (p) =>{
        if(p.id == id){
            p.cantidad = p.cantidad + 1;
        }
        return p;
            
    });
    localStorage.setItem('carrito',JSON.stringify(carrito));
    return renderProductosEnCarrito();
}

function decrementar(id){
    let inputCantidad = document.querySelector('#cantidad-'+id);
    if(inputCantidad.value == 1) return;
    inputCantidad.value = parseInt(inputCantidad.value) - 1;
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito = carrito.map( (p) =>{
        if(p.id == id){
            p.cantidad = p.cantidad - 1;
        }
        return p;
            
    });
    localStorage.setItem('carrito',JSON.stringify(carrito));
    return renderProductosEnCarrito();
}