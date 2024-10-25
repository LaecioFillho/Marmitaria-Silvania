const buttonOpenCart = document.querySelector('.btn-cart')
const buttonCloseCart = document.querySelector('.btnCloseCart')
const buttonCloseChoice = document.querySelector('.btnCloseChoice')
const buttonAddItem = document.querySelector('.btn-products')
const buttonAddMeat = document.querySelector('.btnNext')
const buttonFinishOrder = document.querySelector('.btnFinish')
const buttonOpenChoice = [...document.querySelectorAll('.btn-choiceMeat')]
const buttonChoiceMeat = [...document.querySelectorAll('.btn-choice')]


const cartItems = document.querySelector('.cartItems')
const menu = document.querySelector('.menu')
const addCartItems = document.querySelector('.addCartItems')
const totalCart = document.querySelector('.cart-total')
const countItemsCart = document.querySelector('.cart-count-items')
const typesMeat = document.querySelector('.typesMeat')
const MeatAlternative = document.querySelector('.p-alternative')
const pfs = document.querySelector('.pf')

let name1 = ""
let meat = ""
let price = ""
let cart =[]
let totalConta = 0
const [buttonsMeat1, buttonsMeat2, buttonsMeat3, buttonsMeat4] = buttonOpenChoice
const [btnChoice1, btnChoice2, btnChoice3, btnChoice4, btnChoice5] = buttonChoiceMeat

//Abrir e Fechar o cart de Escolha de carnes
buttonsMeat1.addEventListener('click', () => {
    typesMeat.style.display = 'flex'
})

buttonsMeat2.addEventListener('click', () => {
    typesMeat.style.display = 'flex'
})
buttonsMeat3.addEventListener('click', () => {
    typesMeat.style.display = 'flex'
})

buttonsMeat4.addEventListener('click', () => {
    typesMeat.style.display = 'flex'
})

buttonCloseChoice.addEventListener('click', () => {
  typesMeat.style.display = 'none'
})

typesMeat.addEventListener("click", (event) => {
  if(event.target === typesMeat){
    typesMeat.style.display = 'none'
  }
})

buttonAddMeat.addEventListener('click', () => {
  cartItems.style.display = 'flex'
  typesMeat.style.display = 'none'
  MeatAlternative.style.display = 'block'
})

//Abrir e Fechar o cart de Pedidos
buttonOpenCart.addEventListener('click', () => {
    cartItems.style.display = 'flex'
})

buttonCloseCart.addEventListener('click', () => {
    cartItems.style.display = 'none'
    typesMeat.style.display = 'none'
})

cartItems.addEventListener("click", (event) => {
    if(event.target === cartItems){
        cartItems.style.display = "none"
    }
})

//Obtêm as informações do que está sendo adicionado no pedido.

pfs.addEventListener("click", (event) => {
    let parentButton = event.target.closest('.btn-pf')

    if(parentButton){
        name1 = parentButton.getAttribute("data-name")
        price = parseFloat(parentButton.getAttribute("data-price"))

        typesMeat.addEventListener("click", (event) =>{
          let parentButton2 = event.target.closest('.btn-choice')

            if(parentButton2){
                meat = parentButton2.getAttribute("data-name")
                addToCart(name1, price, meat)
            }
        })
    }
})

menu.addEventListener("click", (event) => {
  let parentButton3 = event.target.closest('.btn-products')

  if(parentButton3){
      name1 = parentButton3.getAttribute("data-name")
      price = parseFloat(parentButton3.getAttribute("data-price"))
      meat = ""

      addToCart(name1, price, meat)
  }
})

//Adiciona os Items a Lista de pedido no Carrinho

function addToCart(name, price, meat) {
    //const existingItem = cart.find(item => item.name === name)
    //if(existingItem){
     //Se o item já existe, aumenta apenas a quantidade + 1
    // existingItem.quantity += 1;
    //}else{
    //}
    cart.push({
      name,
      meat,
      price,
      quantity: 1,
    },)
    updateCart()
}

//Atualiza o Carrinho

function updateCart(){
    addCartItems.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

      cartItemElement.innerHTML = `
        <div class="itemPedido">
            <div>
                <p class="p-pedido">${item.name}</p>
                <p class="p-pedido">${item.meat}</p>
                <p>Quantidade: <span class="p-count">${item.quantity}<span></p>
                <p class="p-pedido">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="removeItem" data-name="${item.name}">
                Remover
            </button>
        </div>
        <hr/>
      `
      total += item.price * item.quantity
      totalConta = total
      addCartItems.appendChild(cartItemElement)
    })
    totalCart.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    countItemsCart.innerHTML = cart.length
}


// Função para remover o item do carrinho

addCartItems.addEventListener("click", (event) => {
    if(event.target.classList.contains("removeItem")){
      const name = event.target.getAttribute("data-name")
      removeItemCart(name);
    }
  })

  function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
      const item = cart[index];

      if(item.quantity > 1){
        item.quantity -= 1;
        updateCart();
        return;
      }
      cart.splice(index, 1);
      updateCart();
    }
}

// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 7 && hora < 22;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("hours-func")
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.style.backgroundColor = "green"
}else{
  spanItem.style.backgroundColor = "red"
}

// Finalizar pedido

buttonFinishOrder.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();

    if(!isOpen){

      Toastify({
        text: "Ops o restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
          width: "200px",
          padding: "15px",
          position: "fixed",
          borderRadius: "10px",
          color: "white",
          zIndex: "99",
          fontFamily: "Poppins, sans-serif",
        },
      }).showToast();
      return;
    }

    //Enviar o pedido para api whats
    const initial = "Qtd.     Produtos      Valor R$"
    const itemsCart = cart.map((item) => {
        return (
          `-------------------------------
          ${""}
          ${item.quantity}    ${item.name}    ${item.price},00; `
        )
    }).join("  ")

    const messege = `-------------------------------
                    Total a pagar:       R$ ${totalConta.toFixed(2)}`
    const phone = "5588998097570"

    window.open(`https://wa.me/${phone}?text=${initial}${itemsCart}${messege}`, "_blank")

    updateCart();
})
