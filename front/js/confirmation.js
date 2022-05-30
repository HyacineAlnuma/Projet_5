const parseURL = new URL (window.location.href);
const id = parseURL.searchParams.get("id");

const orderId = document.getElementById("orderId");
orderId.innerHTML = id;