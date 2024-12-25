window.addEventListener('load', () => {

    renderCardsProductos();
    renderCountCarrito();

    window.addEventListener('scroll', function (e) {
        let header = this.document.querySelector('header');
        let logoHeader = this.document.querySelector('.logo-header');
        const heroOpas = this.scrollY / 2000;
        if(this.scrollY < 80){
            //header.style.backgroundColor = 'rgba(255, 255, 255)';
            header.style.height = '110px'; 
            logoHeader.style.height = 'auto';
            logoHeader.style.width = '110px';
        }else {
            //header.style.backgroundColor = `rgba(255, 255, 255,${heroOpas})`;
            header.style.height = '80px'; 
            logoHeader.style.height = '60px';
            logoHeader.style.width = '90px';
        }
           
    });

    document.querySelector('#iconSearch').addEventListener("click", () => {
        document.querySelector('.search').classList.add('show-search-input');
    })

    emailjs.init({
		publicKey: "QmH-HASr6BtPvF05X",
	});

});

function renderCardsProductos(){
    fetch('./productos.json')
    .then((response) => { 
        response.json().then((productos) => {
            //listado de productos disponibles 
            console.log('productos disponibles: ',productos);
            let productosContainer = document.querySelector('#productosContainer');
            let html = '';
            productos.forEach(producto => {
                html += 
                    `<div class="producto-card"  onclick=mostrarDetalleProducto('${producto.id}')>
                        <div>
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <h4>${producto.nombre}</h4>
                        <span>$${producto.precio}</span>
                        <button><span onclick="agregarProducto(event)" data-id=${producto.id} data-nombre='${producto.nombre}' data-precio=${producto.precio}>AGREGAR AL CARRITO</span></button>
                    </div>`;
                productosContainer.innerHTML = html;
            });
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

function agregarProducto(event){
    var producto = {
        id: event.target.getAttribute('data-id'),
        nombre: event.target.getAttribute('data-nombre'),
        precio: event.target.getAttribute('data-precio'),
        cantidad: 1
    };
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if(!carrito){
        //si el carrito esta vacio agrego directamente el producto seleccionado
        carrito = [];
        carrito.push(producto);
        localStorage.setItem('carrito',JSON.stringify(carrito));
    }else{
        //si el carrito esta creado verifico si el producto ya está agregado
        let productoEnCarrito = carrito.find(p => p.id == producto.id);
        if(productoEnCarrito){
            carrito = carrito.map( (p) =>{
                        if(p.id == producto.id)
                            p.cantidad = p.cantidad + 1;
                        return p;
                    });
            localStorage.setItem('carrito',JSON.stringify(carrito));
        }else{
            //agrego producto a carrito
            carrito.push(producto);
            localStorage.setItem('carrito',JSON.stringify(carrito));
        }
    }
    return renderCountCarrito();
}

function mostrarDetalleProducto(id=null){
    if(!id) return;
    fetch('./productos.json')
    .then((response) => { 
        response.json().then((productos) => {
            let producto = productos.find((p)=> p.id == id);
            console.log("detalle de producto: ",producto);
            });
        });
}

function renderCountCarrito(){
    let countCarrito = document.querySelector('#countCarrito');
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let count = 0;
    if(carrito && carrito.length > 0){
        for(let producto of carrito){
            count += producto.cantidad;
        }
    }
    return countCarrito.innerHTML = count;    
}

function enviarEmail(event){
	event.preventDefault();
	const serviceID = "service_wlegu8g";
	const templateID = "template_3ucqt7l";
	const templateParams = {
		from_name: document.querySelector('#from_name').value,
		email_id: document.querySelector('#email_id').value,
		message: document.querySelector('#message').value
	};
	
	if(validarFormulario(templateParams)){
		emailjs.send(serviceID,templateID,templateParams).then(
			() => {
                document.querySelector('.msj-success').style.display = 'block';
			},
			(err) => {
				console.log(err);
			} 
		)
	};
	
}

function validarFormulario(params){
	Object.keys(params).forEach(function(key) {
		document.querySelector(`#${key}-error`).style.display = "none";
	});
	let error = 1;
	Object.keys(params).forEach(function(key) {
		if(params[key] == ""){
			document.querySelector(`#${key}-error`).innerHTML = "* El campo es requerido";
			document.querySelector(`#${key}-error`).style.display = "block";
			error = 0;
		}
		if(params[key] != "" && key == 'email_id'){
			if(!validateEmail(params[key])){
				document.querySelector(`#${key}-error`).innerHTML = "* El email es incorrecto";
				document.querySelector(`#${key}-error`).style.display = "block";
				error = 0;
			}
				
		}
	});
	return error;
}

function validateEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}