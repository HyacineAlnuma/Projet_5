let cart = JSON.parse(localStorage.getItem("cart"));
const cartSection = document.getElementById("cart__items");

let productPrices = [];
let productQuantities = [];
const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const formInputs = [firstName,lastName,city];

const contactForm = document.getElementById("contact_form");
const orderBtn = document.getElementById("order");
let submitCart = [];
let contact = {firstName: firstName.value, lastName: lastName.value, address: address.value, city: city.value, email: email.value};

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
                productQuantities.push(Number(item.quantity));
                const quantitySelection = document.createElement("input");
                quantitySelection.classList.add("itemQuantity");
                quantitySelection.setAttribute ('type', "number");
                quantitySelection.setAttribute ('name', "itemQuantity");
                quantitySelection.setAttribute ('min', "1");
                quantitySelection.setAttribute ('max', "100");
                const settingsDelete = document.createElement("div");
                settingsDelete.classList.add("cart__item__content__settings__delete");
                const deleteItem = document.createElement("p");
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
    for (let i = 0; i < productQuantities.length; i++) {
        sumQuantity += productQuantities[i];
    }
    totalQuantity.innerHTML = sumQuantity;
}

display(cart);
sumPrices();
sumArticles();

function deleteProduct() {

}

function changeQuantity() {

}

function createSubmitCart() {
    for (let product of cart) {
        submitCart.push(product.id);
    }
}

createSubmitCart();

function disableSubmit(disabled) {
    if (disabled) {
        orderBtn.setAttribute("disabled", true);
    } else {
        orderBtn.removeAttribute("disabled");
    }
}

disableSubmit();

formInputs.forEach(function(elem) {
    elem.addEventListener("input", function(e) {
        if (/[0-9]/.test(e.target.value)) {
            disableSubmit(true);
        } else {
            disableSubmit(false)
        }
    });
});

firstName.addEventListener("input", function(e) {
    if (/[0-9]/.test(e.target.value)) {
        document
        .getElementById("firstNameErrorMsg")
        .innerHTML = "Veuillez saisir un prénom valide";
        //disableSubmit(true);
    } else {
        document
        .getElementById("firstNameErrorMsg")
        .innerHTML = "";
        //disableSubmit(false);
    }
})

lastName.addEventListener("input", function(e) {
    if (/[0-9]/.test(e.target.value)) {
        document
        .getElementById("lastNameErrorMsg")
        .innerHTML = "Veuillez saisir un nom valide";
        //disableSubmit(true);
    } else {
        document
        .getElementById("lastNameErrorMsg")
        .innerHTML = "";
        //disableSubmit(false);
    }
})

city.addEventListener("input", function(e) {
    if (/[0-9]/.test(e.target.value)) {
        document
        .getElementById("cityErrorMsg")
        .innerHTML = "Veuillez saisir une ville valide";
        //disableSubmit(true);
    } else {
        document
        .getElementById("cityErrorMsg")
        .innerHTML = "";
    }
})

email.addEventListener("input", function(e) {
    if (/@/.test(e.target.value)) {
        document
        .getElementById("emailErrorMsg")
        .innerHTML = "";
    } else {
        document
        .getElementById("emailErrorMsg")
        .innerHTML = "Veuillez saisir un email valide";
        //disableSubmit(true);
    }
})

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const stringSubmitCart = JSON.stringify(submitCart);
    const stringContact = JSON.stringify(contact);
    const submitInfos = stringContact + stringSubmitCart;
    console.log(submitInfos);
    //console.log(contact);
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({submitInfos})
    })
    .then(res => res.json())
    .then(value => {
        console.log(value);
    })
    .catch(err => console.log("error", err))
});

/*const deleteItem = document.getElementsByClassName("deleteItem");

function test() {
    for (let p of deleteItem) {
        p.addEventListener("click", function() {
            cart.splice(p, 1);
        })
    }
}

test();*/

