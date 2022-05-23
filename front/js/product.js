const parseURL = new URL (window.location.href);
const id = parseURL.searchParams.get("id");
const itemImg = document.getElementsByClassName("item__img");


if (sessionStorage.getItem("products") != null) {
    let data = sessionStorage.getItem("products");
    data = JSON.parse(data);
    display(data);
} else {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            sessionStorage.setItem("products", JSON.stringify(data));
            display(data);
        })
        .catch(err => console.log("error", err))
}

function display(data) {
    for (let product of data) {
        if (product._id == id) {
            const sofaImage = document.createElement("img");
            sofaImage.setAttribute('src', `${product.imageUrl}`);
            sofaImage.setAttribute('alt', `${product.altTxt}`);
            itemImg[0].appendChild(sofaImage);

            const sofaName = document.getElementById("title");
            sofaName.innerHTML = product.name;

            const sofaPrice = document.getElementById("price");
            sofaPrice.innerHTML = product.price;

            const sofaDescription = document.getElementById("description");
            sofaDescription.innerHTML = product.description;

            for (let color of product.colors) {
                const colorOption = document.createElement("option");
                const selectColor = document.getElementById("colors");
                colorOption.innerHTML = color;
                colorOption.setAttribute('value', `${color}`);
                selectColor.appendChild(colorOption);
            }
            break;
        }
    }
}

let cart = [];
const addBtn = document.getElementById("addToCart");


function addToCart() {
    let quantity = document.getElementById("quantity").value;
    //Pour sélectionner la couleur
    let color = document.getElementById("colors").selectedIndex;
    color = document.getElementsByTagName("option")[color].value;

    //"S'il n'y a aucune commande dans la session"
    if (localStorage.getItem("cart") == null) {
        let order = {id: id, color: color, quantity:quantity};
        cart.push(order);
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
    //S'il y a déjà une commande dans la session    
        let localCart = JSON.parse(localStorage.getItem("cart"));
        let productNotInCart = true;
        for (let product of localCart) {
        if (product.id === id && product.color === color) {
            product.quantity = Number(product.quantity) + Number(quantity);
            localStorage.setItem("cart", JSON.stringify(localCart));
            productNotInCart = false;
            break;
        }};
        if (productNotInCart) {
            let order = {id: id, color: color, quantity:quantity};
            localCart.push(order);
            localStorage.setItem("cart", JSON.stringify(localCart));
        }
    }
}

addBtn.addEventListener("click", function() {
    addToCart();
});




