const btn = document.querySelector(".search button");
const search = document.querySelector(".search input");
const radios = document.querySelectorAll('input[type="radio"]');

let products = [];

fetch("./data.json")
  .then(res => res.json())
  .then(data => {
    products = data.products;
    show(products);
  });

function show(list) {
  const container = document.querySelector(".catalog");
  container.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" width="100" height="100">
      <h3>${p.name}</h3> 
      <p>${p.price} ₿</p>
    `;
    container.appendChild(div);
  });
}

btn.addEventListener("click", () => {
  const text = search.value.toLowerCase();
  show(products.filter(p => p.name.toLowerCase().includes(text)))});

search.addEventListener("keypress", e => {
  if (e.key === "Enter") btn.click();
});

radios.forEach(radio => {
  radio.addEventListener("change", () => filterproducts());
});

function filterproducts() {
  const selected = Array.from(radios).find(r => r.checked).value.toLowerCase();

  let filtered = [];
  if (selected === "all products") {filtered = products;}
  else if (selected === "best seller") {filtered = products.filter(p => p.bestSeller);}
  else if (selected === "fashion") {filtered = products.filter(p => p.category === "fashion");}
  else if (selected === "jewelery") {filtered = products.filter(p => p.category === "jewelery");}
  else if (selected === "electronics") {filtered = products.filter(p => p.category === "electronics");}
  else {filtered = products;}
  show(filtered);
}
const dark = document.getElementById('dark');
dark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  dark.classList.toggle('bx-moon');
  dark.classList.toggle('bx-sun');
});
