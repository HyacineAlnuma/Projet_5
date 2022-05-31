let cart = JSON.parse(localStorage.getItem("cart"));
const cartSection = document.getElementById("cart__items");

const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");

/**
 * Les deux tableaux suivants vont permettre de stocker les prix et quantités des produits du panier pour les additionner à l'aide de fonctions afin d'avoir des totaux.
 */
let productPrices = [];
let productQuantity = [];

/**
 * Les deux tableaux suivants vont permettre de stocker les inputs permettant de modifier la quantité d'un produit et les boutons permettant de supprimer un produit.
 */
let quantityInputs = [];
let deleteBtn = [];

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const contactForm = document.getElementById("contact_form");
const orderBtn = document.getElementById("order");
let submitCart = [];

/**
 * Une nouvelle fois, n va ici effectuer une requête seulement si les infos ne pas déjà présente dans le stockage de session.
 */
if (sessionStorage.getItem("products") != null) {
    let data = sessionStorage.getItem("products");
    data = JSON.parse(data);
} else {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem("products", JSON.stringify(data));
        })
        .catch(err => console.log("error", err))
}

/**
 * Cette fonction va permettre d'afficher les produits du "cart" dans la page panier.
 * Nous verrons plus bas la raison pour laquelle nous réintialisons les quatre tableaux au début de la fonction.
 * Ici nous parcourons les produits du "cart" ainsi que les produits issus des infos fournis par l'API. Si une concordance dans l'id de deux produits s'établit entre les deux listes, les infos du produit en questions sont récupérées afin d'être affichées.
 * 
 */
function display(cart) {
    data = JSON.parse(sessionStorage.getItem("products"));
    cart = JSON.parse(localStorage.getItem("cart"));
    quantityInputs = [];
    deleteBtn = [];
    productQuantity = [];
    productPrices = [];
    for (let item of cart) {
        for (let product of data) {
            if (item.id == product._id) {
                const itemArticle = document.createElement("article");
                itemArticle.classList.add("cart__item");
                cartSection.appendChild(itemArticle);

                const itemImage = document.createElement("div");
                itemImage.classList.add("cart__item__img");
                const productImage = document.createElement("img");
                productImage.setAttribute('src', `${product.imageUrl}`);
                productImage.setAttribute('alt', `${product.altTxt}`);
                itemArticle.appendChild(itemImage);
                itemImage.appendChild(productImage);

                const itemContent = document.createElement("div");
                itemContent.classList.add("cart__item__content");

                const itemDescription = document.createElement("div");
                itemDescription.classList.add("cart__item__content__description");
                const itemName = document.createElement("h2");
                itemName.innerHTML = product.name;
                const itemColor = document.createElement("p");
                itemColor.innerHTML = item.color;
                const itemPrice = document.createElement("p");
                itemPrice.classList.add("cart__item__content__price");
                itemPrice.innerHTML = product.price * item.quantity + '€';
                productPrices.push(Number((product.price * item.quantity)));
                itemArticle.appendChild(itemContent);
                itemContent.appendChild(itemDescription);
                itemDescription.appendChild(itemName);
                itemDescription.appendChild(itemColor);
                itemDescription.appendChild(itemPrice);

                const itemSettings = document.createElement("div");
                itemSettings.classList.add("cart__item__content__settings");
                const itemQuantity = document.createElement("div");
                itemQuantity.classList.add("cart__item__content__settings__quantity");
                const selectedQuantity = document.createElement("p");
                selectedQuantity.innerHTML = item.quantity;
                productQuantity.push(Number(item.quantity));
                const quantitySelection = document.createElement("input");
                quantityInputs.push(quantitySelection);
                quantitySelection.classList.add("itemQuantity");
                quantitySelection.setAttribute ('type', "number");
                quantitySelection.setAttribute ('name', "itemQuantity");
                quantitySelection.setAttribute ('min', "1");
                quantitySelection.setAttribute ('max', "100");
                const settingsDelete = document.createElement("div");
                settingsDelete.classList.add("cart__item__content__settings__delete");
                const deleteItem = document.createElement("p");
                deleteBtn.push(deleteItem);
                deleteItem.classList.add("deleteItem");
                deleteItem.innerHTML = "Supprimer";
                itemContent.appendChild(itemSettings);
                itemSettings.appendChild(itemQuantity);
                itemQuantity.appendChild(quantitySelection);
                itemQuantity.appendChild(selectedQuantity);
                itemSettings.appendChild(settingsDelete);
                settingsDelete.appendChild(deleteItem);
            }
        }
    }
    changeQuantity();
    deleteProduct();
    sumPrices();
    sumArticles();
}

/** 
 * Cette fonction va permettre de créer un tableau contenant uniquement les id des produits du "cart", puisque le tableau de produits envoyé via la requête POST ne doit contenir que les id.
 */
function createSubmitCart() {
    for (let product of cart) {
        submitCart.push(product.id);
    }
}


display(cart);

createSubmitCart();

/**
 * Cette fonction permet de supprimer un produit depuis cette page, en cliquant sur le bouton "supprimer".
 * Dans la fonction display, à chaque fois que l'on a créé un bouton "supprimer", nous l'avons push dans un tableau nommé "deleteBtn".
 * L'indice d'un bouton "supprimer" dans ce tableau va donc être le même que l'indice du produit dans le cart auquel il est rattaché.
 * Donc lorsque l'on clique sur le bouton "supprimer" d'indice i, le produit d'indice i est supprimé du cart. 
 * Il faut donc ensuite restocker le cart mis à jour dans le stockage local, supprimer le contenu html de la section du panier puis appeler la fonction display() afin que le panier puisse s'afficher de nouveau.
 * Il faut donc réintialiser les tableaux au début de la fonction display afin que les indices correspondent toujours.
 */
function deleteProduct() {
    for (let i in deleteBtn) {
        deleteBtn[i].addEventListener("click", function() {
            cart = JSON.parse(localStorage.getItem("cart"));
            cart.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            cartSection.innerHTML = "";
            display(cart);
        });
    }
}

/**
 * Cette fonction fonctionne sur le même principe que le fonction deleteProduct(), sauf qu'ici elle sert à modifier la quantité d'un produit.
 */
function changeQuantity() {
    for (let i in quantityInputs) {
        quantityInputs[i].addEventListener("change", function() {
            cart = JSON.parse(localStorage.getItem("cart"));
            cart[i].quantity = Number(cart[i].quantity) + Number(quantityInputs[i].value);
            localStorage.setItem("cart", JSON.stringify(cart));
            cartSection.innerHTML = "";
            display(cart);
        });
    }
}

/**
 * Les deux fonctions suivantes servent à totaliser le prix et la quantité des produits du panier.
 */
function sumPrices() {
    let sumPrice = 0;
    for (let i = 0; i < productPrices.length; i++) {
        sumPrice += productPrices[i];
    }
    totalPrice.innerHTML = sumPrice;
}

function sumArticles() {
    let sumQuantity = 0;
    for (let i = 0; i < productQuantity.length; i++) {
        sumQuantity += productQuantity[i];
    }
    totalQuantity.innerHTML = sumQuantity;
}

/**
 * Le code suivant va permettre de vérifier ce qui est saisie dans les champs du formulaire.
 * En cas d'erreur un message s'affiche, chaque champ a un message d'erreur distinct.
 * Les champs « prénom », « nom » et « ville » ne peuvent contenir que des lettres, le champ « adresse » ne peut contenir que des lettres et des chiffre, le champ « email » doit contenir un @.
 */
for (let input of contactForm) {
    input.addEventListener("input", function(e) {
        switch (this.name) {
            case "firstName":
                if (/^[a-zA-Z]+$/g.test(e.target.value)) {
                    document
                    .getElementById("firstNameErrorMsg")
                    .innerHTML = "";
                } else {
                    document
                    .getElementById("firstNameErrorMsg")
                    .innerHTML = "Veuillez saisir un prénom valide";
                }
            break;
            case "lastName":
                if (/^[a-zA-Z]+$/g.test(e.target.value)) {
                    document
                    .getElementById("lastNameErrorMsg")
                    .innerHTML = "";
                } else {
                    document
                    .getElementById("lastNameErrorMsg")
                    .innerHTML = "Veuillez saisir un nom valide";
                }
            break;
            case "address":
                if (/^[A-Za-z0-9 ]+$/.test(e.target.value)) {
                    document
                    .getElementById("addressErrorMsg")
                    .innerHTML = "";
                } else {
                    document
                    .getElementById("addressErrorMsg")
                    .innerHTML = "Veuillez saisir une adresse valide";
                }
            break;
            case "city":
                if (/^[a-zA-Z]+$/g.test(e.target.value)) {
                    document
                    .getElementById("cityErrorMsg")
                    .innerHTML = "";
                } else {
                    document
                    .getElementById("cityErrorMsg")
                    .innerHTML = "Veuillez saisir une ville valide";
                }
            break;
            case "email":
                if (/@/.test(e.target.value)) {
                    document
                    .getElementById("emailErrorMsg")
                    .innerHTML = "";
                } else {
                    document
                    .getElementById("emailErrorMsg")
                    .innerHTML = "Veuillez saisir un email valide";
                }
            break;
        }
    })
}

/**
 * L'évènement submit suivant va permettre d'envoyer le formulaire sous certaines conditions.
 * Tout d'abord on créer un tableau "error".
 * S'il y a une erreur dans l'un des champs du formulaire, on push dans le tableau un message d'erreur.
 * Si le tableau est vide, c'est donc qu'il n'y a aucune erreur dans le formulaire, on peut donc effectuer la requête POST.
 * On créer donc un objet contenant un objet contact, contenant lui même les informations saisies par l'utilisateur dans le formulaire, ainsi qu'un tableau contenant les id des produits du panier.
 * Avant d'effectuer la requête on vérifie que : contact soit bien un objet et qu'il n'est pas vide, submitCart soit bien un tableau et qu'il n'est pas vide.
 * Une fois la requête passée, on met un attribut onclick sur le bouton commander afin d'effectuer une redirection vers la page de confirmation. On met dans l'URL du href le numéro de commande que l'on a récupérer avec la requête POST.
 * Si le tableau error contient un/des élément(s), c'est donc qu'il y a eu une ou plusieurs erreur dans la saisie des champs du formulaire, on n'effectue donc pas la requête et on affiche en alerte le tableau error, qui contient donc les messages d'erreur.
 * error.join("\n") permet juste d'ajouter un saut de ligne entre les messages d'erreur.
 */
contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let error = [];
    for (let input of this) {
        switch (input.name) {
            case "firstName":  
                if (!/^[a-zA-Z]+$/g.test(input.value)) {
                    error.push("Erreur dans la saisie de votre prénom");
                }
            break;
            case "lastName":
                if (!/^[a-zA-Z]+$/g.test(input.value)) {
                    error.push("Erreur dans la saisie de votre nom");
                }
            break;
            case "address":
                if (!/^[A-Za-z0-9 ]+$/.test(input.value)) {
                    error.push("Erreur dans la saisie de votre adresse");
                }
            break;
            case "city":
                if (!/^[a-zA-Z]+$/g.test(input.value)) {
                    error.push("Erreur dans la saisie de votre ville");
                }
            break;
        }
    }
    if (error.length == 0) {
        let contact = {};
        let submitInfo = {
            contact: {
            firstName: firstName.value, 
            lastName: lastName.value, 
            address: address.value, 
            city: city.value, 
            email: email.value,
            },
            products: submitCart
        };
        if (typeof contact === "object" && Array.isArray(submitCart) && submitCart !== null && contact !== null) {
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(submitInfo)        
            })
            .then(res => res.json())
            .then(value => {
                orderBtn.setAttribute('onclick', `location.href='./confirmation.html?id=${value.orderId}';`)
            })
            .catch(err => console.log("error", err))
        }
    } else {
        const errorInput = error.join("\n");
        alert(errorInput);
    }
});

