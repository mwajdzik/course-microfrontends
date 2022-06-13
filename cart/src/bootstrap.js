import faker from 'faker';

let cart = `<div>You have ${faker.random.number()} products in your cart</div>`

document.querySelector('#dev-cart').innerHTML = cart;
