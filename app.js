//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM  = document.querySelector(".products-center");
const closeDetailBtn = document.querySelector("close-detail");
const productDetails = document.querySelector("product-details");
const detailsDOM = document.querySelector("details");
const productContent = document.querySelector('.product-content');
//cart
let cart = [];
// let currentProduct = {};
//button
let buttonsDOM = [];

//getting the products
class Products{
    async getProducts(){
        try{
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image};
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

//display products
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product => {
          result +=`
          <!-- single products -->
          <div class="card">
        <div class="product-center">
            <div class="card-group">
                <div class="card">
                  <img src=${product.image}
                   class="card-img" alt="..."
                   style="height: 650px;"
                   >
                  
                </div>
                
                <div class="card">
                  
                  <div class="card-body">
                  <h3>${product.title}</h3>
                    <div class="main">
                        <i class="fa fa-star checked id=one"></i>
                        <i class="fa fa-star checked id=two"></i>
                        <i class="fa fa-star checked id=three"></i>
                        <i class="fa fa-star checked id=four"></i>
                        <i class="fa fa-star unchecked id=five"></i>
                        </div>
                    <p class="card-text">
                        This is a wider card with supporting text below as a natural lead-in to additional content. 
                        This card has even longer content than the first to show that equal height action.</p>
                        <h2>$${product.price}</h2>
                        <div><input type="" class="color"></input></div>
                    <p class="card-text"><small class="text-muted">Select Color</small></p>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-secondary">6</button>
                        <button type="button" class="btn btn-outline-secondary">8</button>
                        <button type="button" class="btn btn-outline-secondary">10</button>
                        <button type="button" class="btn btn-outline-secondary">12</button>
                        <button type="button" class="btn btn-outline-secondary">14</button>
                        <button type="button" class="btn btn-outline-secondary">16</button>
                        <button type="button" class="btn btn-outline-secondary">18</button>
                        <button type="button" class="btn btn-outline-secondary">20</button>
                        
                    </div>
                    <p class="card-text"><small class="text-muted">Select Size</small></p>
                    
                    <div class="">
                    <button type="button" class="btn bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>   
                    add to cart
                    </div>
                  </div>
                </div>
              </div>
         </div>
    </div>
          <!-- end of single products -->
          `;  
        });
        productsDOM.innerHTML = result;
    }

//     checkout(){
//         var retrieveObject = JSON.parse(localStorage.getItem('cart'));
//         console.log(retrieveObject);

//       var tbody = document.getElementById('tbody');
//       for (var i = 0; i < retrievedObject.length; i++) {
//   var tr = "<tr>";
//   tr += "<td>Name</td>" + "<td>" + retrievedObject[i].name + "</td></tr>";
//   tr += "<td>Score</td>" + "<td>" + retrievedObject[i].score + "</td></tr>";
//   tr += "<td>Time</td>" + "<td>" + retrievedObject[i].time + "</td></tr>";
//   tbody.innerHTML += tr;
//     }
    
    // displayDetail(products) {
    //     let results='';
    //     products.
    // }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);

            if (inCart){
                button.innerText = "Add to Cart";
                button.disabled = false;
            }
            else{
                button.addEventListener('click',(event)=>{
                    event.target.innerText = "Add to cart";
                    event.target.disabled = false;
                    
                    //get product from products
                    let cartItem = {...Storage.getProduct(id), amount: 1};
                    
                    //add products to the cart
                    cart = [...cart, cartItem];
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart items
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();

                });
            }
        });
    }
    getDetailButtons() {
        const buttons = document.querySelector(".detail-btn");
        buttonsDOM = buttons;              
                   
        buttons.addEventListener('click', this.showDetails);    
    }


    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = ` <img src=${item.image} alt="product"/>
        <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }

    

        showCart() {
            cartOverlay.classList.add("transparentBcg");
            cartDOM.classList.add("showCart");
          }
        setupAPP() {
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
        }
        populateCart(cart) {
            cart.forEach(item => this.addCartItem(item));
        }
        hideCart() {
            cartOverlay.classList.remove("transparentBcg");
            cartDOM.classList.remove("showCart");
        }
        cartLogic() {
            clearCartBtn.addEventListener('click', () =>{
                this.clearCart();
            });

            //cart functionality
       cartContent.addEventListener('click', event => {
        if(event.target.classList.contains("remove-item")) {
            let removeItem = event.target;
            let id = removeItem.dataset.id;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            this.removeItem(id);
        }
        else if(event.target.classList.contains("fa-chevron-up")) {
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem = cart.find(item => item.id===id);
            tempItem.amount = tempItem.amount +1;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            addAmount.nextElementSibling.innerText = tempItem.amount;
        }
        else if(event.target.classList.contains("fa-chevron-down")) {
            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempItem = cart.find(item => item.id===id);
            tempItem.amount = tempItem.amount -1;
            if (tempItem.amount > 0){
                Storage.saveCart(cart);
                this.setCartValues(cart);
                lowerAmount.previousElementSibling.innerText = tempItem.amount;
            
            }
            else{
                cartContent.removeChild(lowerAmount.parentElement.parentElement);
                this.removeItem(id);
            }
           }
       });
       }
       
       clearCart() {
           let cartItems = cart.map(item => item.id);
           cartItems.forEach(id => this.removeItem(id));
            // console.log(cartContent.children);

           while(cartContent.children.lenght>0){
               cartContent.removeChild(cartContent.children[0]);
           }
           this.hideCart();
       }
       removeItem(id) {
           cart = cart.filter(item => item.id !==id);
           this.setCartValues(cart);
           Storage.saveCart(cart);
           let button = this.getSingleButton(id);
           button.disabled = false;
           button.innerHTML =`<i class="fas fa-shopping-cart"></i>add to cart`;
       }
       getSingleButton(id) {
           return buttonsDOM.find(button => button.dataset.id === id);
       }

       
}

//local storage
class Storage{
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
const ui = new UI();
const products = new Products();
//setup app
ui.setupAPP();
//get all products
products.getProducts().then(products => {
   ui.displayProducts(products);
    Storage.saveProducts(products);
}).then(() => {
    ui.getBagButtons();
    ui.cartLogic();
});

})