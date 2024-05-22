const buttonOpenCart = document.querySelector('.btn-cart')
const buttonCloseCart = document.querySelector('.btnCloseCart')
const buttonAddItem = document.querySelector('.btn-products')
const buttonFinishOrder = document.querySelector('.btnFinish')

const cartItems = document.querySelector('.cartItems')
const menu = document.querySelector('.menu')
const addCartItems = document.querySelector('.addCartItems')
const totalCart = document.querySelector('.cart-total')
const countItemsCart = document.querySelector('.cart-count-items')

let cart =[]


buttonOpenCart.addEventListener('click', () => {
    cartItems.style.display = 'flex'
})

buttonCloseCart.addEventListener('click', () => {
    cartItems.style.display = 'none'
})

cartItems.addEventListener("click", (event) => {
    if(event.target === cartItems){
        cartItems.style.display = "none"
    }
})

//Obtêm as informações do que está sendo adicionado no pedido.

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest('.btn-products')
  
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
      
    }
})

//Adiciona os Items a Lista de pedido no Carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
     //Se o item já existe, aumenta apenas a quantidade + 1 
     existingItem.quantity += 1;
    }else{
      cart.push({
        name,
        price,
        quantity: 1,
      })
    }
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
    return hora >= 8 && hora < 22; 
    //true = restaurante está aberto 
}

const spanItem = document.getElementById("hours-func")
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
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
        },
      }).showToast();
      return;
    }

    //Enviar o pedido para api whats
    const itemsCart = cart.map((item) => {
        return (
        ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(itemsCart)
    const phone = "88992004177"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

    cart = [];
    updateCart();
})
