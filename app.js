const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");

const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateShoppingCart = document.getElementById(
  "template-shoppingCart"
).content;

const fragment = document.createDocumentFragment();
let shoppingCart = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("shoppingCart")) {
    shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    pintarShoppingCart();
  }
});
cards.addEventListener("click", (e) => {
  addShoppingCart(e);
});

items.addEventListener("click", (e) => {
  botonAccion(e);
});

const fetchData = async () => {
  try {
    const res = await fetch(
      "https://www.omdbapi.com/?s=batman&apikey=3c3fc216"
    );
    const data = (await res.json()).Search;
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  console.log(data);
  data.forEach((producto) => {
    templateCard.querySelector("h5").textContent = producto.Title;
    templateCard.querySelector("p").textContent = producto.Year;
    templateCard.querySelector("img").setAttribute("src", producto.Poster);
    templateCard.querySelector(".boton-1").dataset.id = producto.imdbID;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addShoppingCart = (e) => {
  if (e.target.classList.contains("boton-1")) {
    setShoppingCart(e.target.parentElement);
  }
  e.stopPropagation();
};
const setShoppingCart = (objeto) => {
  const producto = {
    id: objeto.querySelector(".boton-1").dataset.id,
    title: objeto.querySelector("h5").textContent,
    year: objeto.querySelector("p").textContent,
    quantity: 1,
  };
  shoppingCart[producto.id] = { ...producto };
  pintarShoppingCart();
};

const pintarShoppingCart = () => {
  items.innerHTML = "";
  Object.values(shoppingCart).forEach((producto) => {
    templateShoppingCart.querySelector("th").textContent = producto.id;
    templateShoppingCart.querySelectorAll("td")[0].textContent = producto.title;
    templateShoppingCart.querySelectorAll("td")[1].textContent = producto.year;
    templateShoppingCart.querySelector(".boton-2").dataset.id = producto.id;

    const clone = templateShoppingCart.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(shoppingCart).length === 0) {
    footer.innerHTML =
      '<th scope="row" colspan="5">Carrito vacío - agregar películas!</th>';
    return;
  }

  const nQuantity = Object.values(shoppingCart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = nQuantity;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const botonVaciar = document.getElementById("clean-shoppingCart");
  botonVaciar.addEventListener("click", () => {
    shoppingCart = {};
    pintarShoppingCart();
  });
};

const botonAccion = (e) => {
  console.log(e.target);
  if (e.target.classList.contains("boton-info")) {
    console.log(shoppingCart[e.target.dataset.id]);
    const producto = shoppingCart[e.target.dataset.id];
    producto.quantity++;
    shoppingCart[e.target.dataset.id] = { ...producto };
    pintarShoppingCart();
  }

  if (e.target.classList.contains("boton-2")) {
    const producto = shoppingCart[e.target.dataset.id];
    producto.quantity--;
    if (producto.quantity === 0) {
      delete shoppingCart[e.target.dataset.id];
    }
    pintarShoppingCart();
  }

  e.stopPropagation();
};
