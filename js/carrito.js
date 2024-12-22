$(document).ready( () => {
    renderCountCarrito();
    renderProductosEnCarrito();
});

function renderProductosEnCarrito(){
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if(!carrito) return false;
    let html = '';
    let precioTotal = 0;
    carrito.forEach(producto => {
        precioTotal += producto.cantidad * producto.precio;
        html += 
            `<div class="card">
                <img src="${producto.imagen}" width="60" height="60"/>
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

    if(carrito && carrito.length > 0){
        html += `<span> Precio Total: $${parseFloat(precioTotal).toFixed(3)}</span>`;
        $('.carro-productos').html(html);
    }else{
        $('.carro-productos').hide();
        $('.carro-vacio').show();
    }
   
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
    if(!carrito){
        $('.carro-vacio').show();
        return $('#countCarrito').html(count);
    }
    for(let producto of carrito){
        count += producto.cantidad;
    }
    return $('#countCarrito').html(count);      
}

function incrementar(id){
    let cantidad = parseInt($('#cantidad-'+id).val());
    $('#cantidad-'+id).val(parseInt(cantidad) + 1);
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
    let cantidad = parseInt($('#cantidad-'+id).val());
    if(cantidad == 1) return;
    $('#cantidad-'+id).val(parseInt(cantidad) - 1);
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