/* -------------------------------------------------------------------------- */
/*                                  VARIABLES                                 */
/* -------------------------------------------------------------------------- */

const cartBtn = document.querySelectorAll(".cart-btn");
const closeCartBtn = document.querySelectorAll(".close-cart");
const clearCartBtn = document.getElementById("clear-cart");
const cartDOM = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartContent = document.querySelectorAll(".cart-content");
let contenedor_remeras_stock = document.getElementById("contenedorRemeras");
let bagCart = document.getElementById("bag-cart");
let crossCart = document.querySelectorAll(".close-cart");
let cartTotal = document.getElementById("cart-total");
let cartItems = document.getElementById("cart-items");
let off = document.getElementById("descuento");

let cart = [];

/* -------------------------------------------------------------------------- */
/*                               SHOW/EXIT CART                               */
/* -------------------------------------------------------------------------- */

bagCart.addEventListener("click", () => {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
});

for (let cross of crossCart) {
    cross.addEventListener("click", () => {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    })
};

/* -------------------------------------------------------------------------- */
/*                              PRODUCTS IN STOCK                             */
/* -------------------------------------------------------------------------- */

class Remera {
    constructor (id_card, id_btn_card, nombre, imagen, alt, mangas, color, precio, cantidad) {
        this.id_card = id_card;
        this.id_btn_card = id_btn_card;
        this.nombre = nombre;
        this.imagen = imagen;
        this.alt = alt;
        this.mangas = mangas;
        this.color = color;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}

let ficcion = new Remera('ficcion', 'ficcion_btn', 'FICCIÓN', './img/remeron-ficcion.jpg', 'Remerón collage ficción', 'Blanco', 'Remerón', 4200, 1);
let jardin = new Remera('jardin', 'jardin_btn', 'JARDÍN MÁGICO', './img/remeron-jardin.jpg', 'Remerón collage jardín', 'Blanco', 'Remerón', 4200, 1);
let luna = new Remera('luna', 'luna_btn', 'LUNA', './img/remeron-luna.jpg', 'Remerón collage luna', 'Blanco', 'Remerón', 4200, 1);
let harta_naranja = new Remera('hartaNaranja', 'harta_naranja_btn', 'HARTA', './img/remeron-harta-naranja.jpg', 'Remerón collage harta', 'Blanco', 'Remerón', 4200, 1);
let caos_blanco = new Remera('caosBlanco', 'caos_blanco_btn', 'DEL CAOS FLORECE', './img/caos-blanco.jpg', 'Musculosa collage caos', 'Blanco', 'Musculosa', 3200, 1);
let mente_blanco = new Remera('menteBlanco', 'mente_blanco_btn', 'LA LLAVE', './img/mente-blanco.jpg', 'Musculosa collage llave', 'Blanco', 'Musculosa', 3200, 1);

let remeras_en_stock = [ficcion, jardin, luna, harta_naranja, caos_blanco, mente_blanco];

remeras_en_stock.forEach((producto) => {
    const div_producto = document.createElement("div");
    div_producto.classList.add("card");
    div_producto.style.width = "18rem";
    div_producto.innerHTML = `
    <div id="${producto.id_card}">
        <img src="${producto.imagen}" class="card-img-top img-fluid py-3" alt="${producto.alt}">
        <div class="card-body">
            <h4 class="card-title"> ${producto.nombre} </h4>
            <p class="card-text"> ${producto.mangas} | ${producto.color} </p>
            <h5> $${producto.precio} </h5>
            <button id="${producto.id_btn_card}" class="btn btn-primary btnProduct btnComprar"> Agregar al Carrito </button>
        </div>
    </div>`;
    contenedor_remeras_stock.appendChild(div_producto);
    //Event Listener to Every Card Button
    let btns_comprar = document.querySelectorAll(".btnComprar");
    for (let boton of btns_comprar) {
        boton.addEventListener("click", agregar_a_carrito);
    }
})

/* -------------------------------------------------------------------------- */
/*                                 ADD/REMOVE TO/FROM CART                                */
/* -------------------------------------------------------------------------- */

//Agregar productos al carrito
function agregar_a_carrito (e) {
    let btn_compra = e.target.id;
    let inCart = remeras_en_stock.find(element => element.id_btn_card === btn_compra);
    cart.push(inCart);
    renderizar_carrito();
    actualizar_items_carrito();
    aplicar_descuento();
};

//Renderizar los productos en el carrito
function renderizar_carrito() {
    let cartContent = document.getElementById("cart-content");
    cartContent.innerHTML = "";
    cart.forEach(producto => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `<img src="${producto.imagen}" alt="${producto.alt}">
        <div class="cart-item-data">
            <div>
                <h4>${producto.nombre}</h4>
                <h5>$${producto.precio}</h5>
                <span class="remove-item">Quitar</span>
            </div>
            <div class="arrows">
                <img src="./img/down-arrow.png" alt="flecha para agregar producto">
                <p class="item-amount">${producto.cantidad}</p>
                <img src="./img/down-arrow.png" alt="flecha para reducir producto">
            </div>
        </div>`;
        cartContent.append(cartItem);
    });    
    //Quitar producto DOM
    let btn_quitar = document.getElementsByClassName("remove-item");
    for (let boton of btn_quitar) {
        boton.addEventListener("click", (e) => {
            let eliminarProducto = e.target.parentNode.parentNode.parentNode;
            eliminarProducto.remove();
        });
    };
    //Limpiar carrito
    clearCartBtn.addEventListener("click", () => {
        cart = [];
        cartContent.remove();
        cartTotal.innerText = 0;
        cartItems.innerText = 0;
        off.innerText = 0;
    });
    //Calcular total
    calcular_total();
};


/* -------------------------------------------------------------------------- */
/*                                TOTAL IN CART                               */
/* -------------------------------------------------------------------------- */

function actualizar_items_carrito () {
    let itemsTotal = 0;
    cart.forEach(item => {
        itemsTotal += item.cantidad
    });
    cartItems.innerText = itemsTotal;
};

function calcular_total () {
    let total = 0;
    cartTotal.innerText = 0;
    cart.forEach((producto) => {
        total += producto.precio * producto.cantidad;
    });
    cartTotal.innerText = total;
}

function aplicar_descuento () {
    cart.forEach(item => {
        let descuentoProducto = item.precio * 0.25;
        off.innerText += descuentoProducto;
        let descuentoTotal = item.precio - descuentoProducto;
        cartTotal.innerText = descuentoTotal;
    });
};