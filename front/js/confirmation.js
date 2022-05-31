/**
 * Ici on récupère le numéro de commande qui se situe dans l'URL, afin de l'afficher sur la page.
 */
const parseURL = new URL (window.location.href);
const id = parseURL.searchParams.get("id");

const orderId = document.getElementById("orderId");
orderId.innerHTML = id;