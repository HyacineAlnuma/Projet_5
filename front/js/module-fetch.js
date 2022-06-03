/**
 * Le code suivant va permettre d'effectuer une requête afin de récupérer les informations, ainsi que de mettre ces dernière en stockage de session.
 * Dans le "if" on va vérifier si les infos sont déjà stockées.
 * Dans le "else", c'est donc si les infos ne sont pas déjà stockées, on va donc effectuer la requête.
 * Dans les 2 cas, cette fonction va retourner les informations (parsées) reçues de l'API
 */
export function fetchData() {
    if (sessionStorage.getItem("products") != null) {
        let data = sessionStorage.getItem("products");
        data = JSON.parse(data);
        return data;
    } else {
        fetch("http://localhost:3000/api/products")
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem("products", JSON.stringify(data));
                data = JSON.parse(data);
                return data;
            })
            .catch(err => console.log("error", err))
    }
}

