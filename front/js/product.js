/**
 * Grâce aux 2 lignes suivantes, on va récupérer l'id du produit qui se trouve dans l'URL.
 */
const parseURL = new URL (window.location.href);
const id = parseURL.searchParams.get("id");

const itemImg = document.getElementsByClassName("item__img");
const addBtn = document.getElementById("addToCart");

let cart = [];

/**
 * Tout comme dans script.js, on va ici effectuer une requête seulement si les infos ne pas déjà présente dans le stockage de session.
 */
if (sessionStorage.getItem("products") != null) {
    let data = sessionStorage.getItem("products");
    data = JSON.parse(data);
    display(data);
} else {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem("products", JSON.stringify(data));
            display(data);
        })
        .catch(err => console.log("error", err))
}

/**
 * Cette fonction va permettre d'afficher le produits ainsi que ses détails.
 * On cherche ici une concordance entre id d'un produit de la liste que nous fournit l'API avec l'id du produit en question.
 */
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

/**
 * Cette fonction va permettre d'ajouter un produit au panier.
 * Premier "if" --> Si la quantité sélectionnée est de 0, affiche un message d'erreur.
 * "else if" --> S'il n'y a rien dans le "cart", le panier stocké en local, on y ajoute tout simplement le produit sélectionné.
 * "else" --> S'il y a déjà un ou plusieurs produits dans le "cart", on vérifie si le produit sélectionné et sa couleur n'y sont pas déjà présents.
 * Si c'est le cas, on incrémente la quantité du produit en question dans le "cart".
 * Si ce n'est pas le cas, on ajoute le produit sélectionné dans le "cart"
 */
function addToCart() {
    let quantity = document.getElementById("quantity").value;
    let color = document.getElementById("colors").selectedIndex;
    color = document.getElementsByTagName("option")[color].value;

    if (Number(quantity) == 0) {
        alert("Veuillez sélectionner une quantité valide")
    } else if (localStorage.getItem("cart") == null) {
        let order = {id: id, color: color, quantity:quantity};
        cart.push(order);
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        let localCart = JSON.parse(localStorage.getItem("cart"));
        let productNotInCart = true;
        for (let product of localCart) {
            if (product.id == id && product.color == color) {
                product.quantity = Number(product.quantity) + Number(quantity);
                localStorage.setItem("cart", JSON.stringify(localCart));
                productNotInCart = false;
                break;
            }
        }
        if (productNotInCart) {
            let order = {id: id, color: color, quantity:quantity};
            localCart.push(order);
            localStorage.setItem("cart", JSON.stringify(localCart));
        }
    }
}


/**
 * Ici on ajoute un évènement "click" au bouton "Ajouter au panier" auquel on va passer la fonction permettant d'ajouter au panier.
 */
addBtn.addEventListener("click", function() {
    addToCart();
});




