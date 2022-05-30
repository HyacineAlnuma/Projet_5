let cart = JSON.parse(localStorage.getItem("cart"));
const cartSection = document.getElementById("cart__items");

let productPrices = [];
let productQuantity = [];
const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");
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
                itemPrice.innerHTML = product.price * item.quantity;
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

display(cart);

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

function createSubmitCart() {
    for (let product of cart) {
        submitCart.push(product.id);
    }
}

createSubmitCart();

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
                console.log(value.orderId);
                orderBtn.setAttribute('onclick', `location.href='./confirmation.html?id=${value.orderId}';`)
            })
            .catch(err => console.log("error", err))
        }
    } else {
        const errorInput = error.join("\n");
        alert(errorInput);
    }
});

