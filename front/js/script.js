const items = document.getElementById("items");

if (sessionStorage.getItem("products") == null) {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            sessionStorage.setItem("products", JSON.stringify(data));
            render(data);
        })
        .catch(err => console.log("error", err))
} else {
    data = JSON.parse(sessionStorage.getItem("products"));
    render(data);
}

function render(data) {
   
    for (let i of data) {
   
    const cardSofaArticle = document.createElement("article");
    const cardSofa = document.createElement("a");
    cardSofa.setAttribute('href', `./product.html?id=${i._id}`);

    const cardSofaName = document.createElement("h3");
    cardSofaName.innerHTML = i.name;

    const cardSofaImg = document.createElement("img");
    cardSofaImg.setAttribute('src', `${i.imageUrl}`);
    cardSofaImg.setAttribute('alt', `${i.altTxt}`);

    const cardSofaDescription = document.createElement("p");
    cardSofaDescription.innerHTML = `${i.description}`;

    items.appendChild(cardSofa);
    cardSofa.appendChild(cardSofaArticle);
    cardSofaArticle.appendChild(cardSofaName);
    cardSofaArticle.appendChild(cardSofaImg);
    cardSofaArticle.appendChild(cardSofaDescription);
    }
}


