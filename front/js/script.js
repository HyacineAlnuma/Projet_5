const items = document.getElementById("items");

/**
 * Le code suivant va permettre de requêter l'API afin d'en récupérer les informations, ainsi que de mettre ces dernière en stockage de session.
 * Dans le "if" on va vérifier si les infos ne sont pas déjà stockées et, le cas échéant, effectuer une requête.
 * Dans le "else", c'est donc si les infos sont déjà stockées, on va donc les parser afin de pouvoir les utiliser.
 * Dans les 2 cas, on va appliquer la fonction render() à ces infos.
 */
if (sessionStorage.getItem("products") == null) {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem("products", JSON.stringify(data));
            render(data);
        })
        .catch(err => console.log("error", err))
} else {
    data = JSON.parse(sessionStorage.getItem("products"));
    render(data);
}

/**
 * Cette fonction va permettre d'afficher les produits sur la page d'accueil à partir des infos de l'API.
 * On va également passer l'id des produits dans les attributs href des cartes produits de manière à ce que lorsque l'on clique sur l'un d'eux, une redirection vers la page du produit en question s'effectue.
 */
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


