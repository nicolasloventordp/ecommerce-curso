$(document).ready( () => {

    renderCardsProductos();
    renderCountCarrito();

    window.addEventListener('scroll', function (e) {
        const heroOpas = this.scrollY / 2000;
        if(this.scrollY < 80){
            $('header').css('background-color',`rgba(255, 255, 255)`); 
            $('header').css('height',`110px`);
            $('header img').css('height',`auto`);
            $('header img').css('width',`110px`);
           
        }else {
            $('header').css('background-color',`rgba(255, 255, 255,${heroOpas})`);
            $('header').css('height',`80px`);
            $('header img').css('height',`60px`);
            $('header img').css('width',`90px`);
        }
           
    });

    $("#iconSearch").on( "click", function() {
        $('.search').addClass('show-search-input');
      });
});

function renderCardsProductos(){
    fetch('./productos.json')
    .then((response) => { 
        response.json().then((productos) => {
            //listado de productos disponibles 
            console.log('productos disponibles: ',productos);
            let html = '';
            productos.forEach(producto => {
                html += 
                    `<div class="producto-card">
                        <div>
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <h4>${producto.nombre}</h4>
                        <span>$${producto.precio}</span>
                        <button><span onclick="agregarProducto(${producto.id})">AGREGAR AL CARRITO</span></button>
                    </div>`;
                $('#productosContainer').html(html);
            });
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

function agregarProducto(id=null){
    if(!id) return;
    fetch('./productos.json')
    .then((response) => { 
        response.json().then((productos) => {
            let productoSeleccionado = productos.find((p)=> p.id == id);
            let carrito = JSON.parse(localStorage.getItem('carrito'));
            if(!carrito){
                //si el carrito esta vacio agrego directamente el producto seleccionado
                carrito = [];
                productoSeleccionado.cantidad = 1;
                carrito.push(productoSeleccionado);
                localStorage.setItem('carrito',JSON.stringify(carrito));
            }else{
                //si el carrito esta creado verifico si el producto ya está agregado
                let productoEnCarrito = carrito.find(p => p.id == productoSeleccionado.id);
                if(productoEnCarrito){
                    carrito = carrito.map( (p) =>{
                        if(p.id == productoSeleccionado.id){
                            if(p.cantidad){
                                p.cantidad = p.cantidad + 1;
                            }else{
                                p.cantidad = 1;
                            }
                        }
                        return p;
                            
                    });
                    localStorage.setItem('carrito',JSON.stringify(carrito));
                }else{
                    //agrego producto a carrito
                    productoSeleccionado.cantidad = 1;
                    carrito.push(productoSeleccionado);
                    localStorage.setItem('carrito',JSON.stringify(carrito));
                }
            }
            renderCountCarrito();
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

function renderCountCarrito(){
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let count = 0;
    if(!carrito){
        return $('#countCarrito').html(count);
    }
    for(let producto of carrito){
        count += producto.cantidad;
    }
    return $('#countCarrito').html(count);      
}
