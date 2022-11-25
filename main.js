/* -------------------------------------------------------------------------- */
/*                                  VARIABLES                                 */
/* -------------------------------------------------------------------------- */

let productsJSON = './products.json';
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
let btnOff = document.getElementById("btn-descuento");
let inputOff = document.getElementById("input-descuento");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* -------------------------------------------------------------------------- */
/*                               SHOW/EXIT CART                               */
/* -------------------------------------------------------------------------- */

bagCart.addEventListener("click", () => {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
    renderizar_carrito();
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

let remeras_en_stock = [];

fetch(productsJSON)
    .then ((response) => response.json())
    .then ((data) => {
        productosStock(data);
        for (let remera of data) {
            remeras_en_stock.push(remera)
        }
    })

const productosStock = (data) => {
    data.forEach((producto) => {
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
}

/* -------------------------------------------------------------------------- */
/*                                 ADD/REMOVE TO/FROM CART                    */
/* -------------------------------------------------------------------------- */

actualizar_items_carrito ();

//Agregar productos al carrito
function agregar_a_carrito (e) {
    let btn_compra = e.target.id;
    const alreadyInCart = id => cart.some(element => element.id_btn_card === id);
    let inCart = remeras_en_stock.find(element => element.id_btn_card === btn_compra);
    if (alreadyInCart(inCart.id_btn_card)) {
        inCart.cantidad++;
        actualizar_items_carrito();
    } else {
        cart.push(inCart);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderizar_carrito();
        actualizar_items_carrito();
    }
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
                <button class="remove-item"<span>Quitar</span></button>
            </div>
            <div class="arrows">
                <img class="arrow-up" src="./img/down-arrow.png" alt="flecha para agregar producto">
                <p class="item-amount">${producto.cantidad}</p>
                <img class="arrow-down" src="./img/down-arrow.png" alt="flecha para reducir producto">
            </div>
        </div>`;
        cartContent.append(cartItem);
        //Funcionalidad para quitar un producto
        let btn_quitar = document.querySelectorAll(".remove-item");
        for (btn of btn_quitar) {
            btn.addEventListener("click", (e) => {
                let elemento = e.target.parentNode.parentNode.parentNode;
                elemento.remove();
                let dataProducto = e.target.parentNode
                let nombreProducto = dataProducto.children[0].innerText;
                let aQuitar = cart.find(element => element.nombre === nombreProducto);
                const quitarElemento = cart.some(item => item.nombre === nombreProducto);
                if (quitarElemento) {
                    cart.splice(cart.indexOf(aQuitar), 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    calcular_total();
                }
            });
        };
    });    
    //Calcular total
    calcular_total();
};

//Limpiar todo el carrito
clearCartBtn.addEventListener("click", () => {
    for (let producto of cart) {
        producto.cantidad = 1;
    }
    cart.splice(0, cart.length);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderizar_carrito();
    actualizar_items_carrito();
});

//Aumentar y disminuir cantidades del producto en carrito
//REVISAR

let addAmount = document.querySelectorAll(".arrow-up");
let lowerAmount = document.querySelectorAll(".arrow-down");

for (let btn_add of addAmount) {
    btn_add.addEventListener("click", hola());
}
for (let low of lowerAmount) {
    low.addEventListener("click", console.log("resta"));
}

function hola () {
    console.log("hola");
};

/* -------------------------------------------------------------------------- */
/*                                   25% OFF                                  */
/* -------------------------------------------------------------------------- */

btnOff.addEventListener("click", () => {
    if (inputOff.value === "SpringSale") {
        Toastify({
            text: "¡Ya podés disfrutar un 25%OFF en toda la tienda! 😎",
            style:{
                fontFamily: 'oswald',
                fontSize: '1.4rem',
                background: '#808C56',
            },
            gravity: "bottom"
        }).showToast();
        calcular_total();
    } else if (inputOff.value === "") {
        console.log("¡Escribí el código SpringSale y animate a adquirir un MEGA descuento!")
    } else {
        Swal.fire({
            title: 'Oops! Código inválido',
            html: 'Volvé a ingresar el cupón de descuento' + '<br>' +
            '(revisá las mayúsculas 😉)',
            icon: 'error'
        });
    }
});

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
    off.innerText = 0;
    cart.forEach((producto) => {
        total += producto.precio * producto.cantidad;
        let descuentoProductos = total * 0.25;
        if (inputOff.value === "SpringSale") {
            off.innerText = descuentoProductos;
            total = total - descuentoProductos;
        }
    });
    cartTotal.innerText = total;
}