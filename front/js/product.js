const parseURL = new URL (window.location.href);
const id = parseURL.searchParams.get("id");

if (sessionStorage.getItem("products") != null) {
    let data = sessionStorage.getItem("products");
    data = JSON.parse(data);

    for (let product of data) {
        if (product._id == id) {
            console.log(product.name);
            break;
        }
    }
} 
