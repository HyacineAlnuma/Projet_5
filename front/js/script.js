/**
 * Ici on importe la fonction fetchData qui retourne les informations reçues de la requête afin de les utiliser dans la fonction display.
 */
import {fetchData} from "./module-fetch.js";
const data = fetchData();

const items = document.getElementById("items");

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

render(data);


