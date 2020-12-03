"use strict";
function initCart() {
	let basket = document.querySelectorAll('.to-cart');

	let goods = [ 
		{
			name: "Apple",
			price: 5,
			label: "apple",
			img: "./img/apple.jpg",
			count: 0
		},
		{
			name: "Cherry",
			price: 7,
			label: "cherry",
			img: "./img/cherry.jpg",
			count: 0
		},
		{
			name: "Lime",
			price: 6,
			label: "lime",
			img: "./img/lime.jpg",
			count: 0
		}
	];

	for(let i=0; i< basket.length; i++) {
		basket[i].addEventListener('click', () => {
			basketCount(goods[i]);
			totalSum(goods[i]);
		});
	}

	function onLoadBasketCount() {
		let productCount = localStorage.getItem('basketCount');
		if( productCount ) {
			document.querySelector('.cart-btn .number-of-goods').textContent = productCount;
		}
	}

	function basketCount(product, act) {
		let productCount = localStorage.getItem('basketCount');
		productCount = parseInt(productCount);

		let basketItems = localStorage.getItem('basketProducts');
		basketItems = JSON.parse(basketItems);

		if( act ) {
			localStorage.setItem('basketCount', productCount - 1);
			document.querySelector('.cart-btn .number-of-goods').textContent = productCount - 1;

		} else if( productCount ) {
			localStorage.setItem('basketCount', productCount + 1);
			document.querySelector('.cart-btn .number-of-goods').textContent = productCount + 1;

		} else {
			localStorage.setItem('basketCount', 1);
			document.querySelector('.cart-btn .number-of-goods').textContent = 1;
		}
		selectedProducts(product);
	}

	function selectedProducts(product) {
		let basketItems = localStorage.getItem('basketProducts');
		basketItems = JSON.parse(basketItems);

		if(basketItems != null) {

			if( basketItems[product.label] == undefined ) {
				basketItems = {
					...basketItems,
					[product.label]: product
				}
			}
			basketItems[product.label].count += 1;

		} else {
			product.count = 1;
			basketItems = { 
				[product.label]: product
			};
		}

		localStorage.setItem('basketProducts', JSON.stringify(basketItems));
	}

	function totalSum( product, act ) {
		let cart = localStorage.getItem('totalSum');

		if( act) {
			cart = parseInt(cart);

			localStorage.setItem('totalSum', cart - product.price);
		} else if(cart != null) {

			cart = parseInt(cart);
			localStorage.setItem('totalSum', cart + product.price);

		} else {
			localStorage.setItem('totalSum', product.price);
		}
	}

	function showBasket() {
		let basketItems = localStorage.getItem('basketProducts');
		basketItems = JSON.parse(basketItems);

		let cart = localStorage.getItem('totalSum');
		cart = parseInt(cart);

		let productBox = document.querySelector('.items');

		if( basketItems && productBox ) {
			productBox.innerHTML = '';
		Object.values(basketItems).map( item => {
			productBox.innerHTML += 
				`<li class="prod">
					<div class="product-box col">
						<button type="button" class="remove"></button>
						<img src="${item.img}" />
						<span class="title">${item.name}</span>
					</div>
					<div class="price col">$ ${item.price}</div>
					<div class="sum col">
						<button type="button" class="minus"> - </button>
						<span>${item.count}</span>
						<button type="button" class="plus"> + </button>
					</div>
					<div class="total col col-total">$ ${item.count * item.price}</div>
				</li>
				`;
			});

			productBox.innerHTML += `
				<div class="basket-total-box">
					<span class="basket-total-title">Total</span>
					<span class="basket-total">$ ${cart}</span>
				</div>
				<button onclick="location.href=createOrder(${cart}, 'Goods')">PAY $ ${cart}</button>
				`
			removeBtn();
			controlSum();
		}
	}

	function controlSum() {
		let minusBtn = document.querySelectorAll('.minus');
		let plusBtn = document.querySelectorAll('.plus');
		let currentSum = 0;
		let currentProduct;
		let basketItems = localStorage.getItem('basketProducts');
		basketItems = JSON.parse(basketItems);

		for(let i=0; i < plusBtn.length; i++) {
			minusBtn[i].addEventListener('click', () => {
				currentSum = minusBtn[i].parentElement.querySelector('span').textContent;
				currentProduct = minusBtn[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'');

				if( basketItems[currentProduct].count > 1 ) {
					basketItems[currentProduct].count -= 1;
					basketCount(basketItems[currentProduct], 'minus');
					totalSum(basketItems[currentProduct], 'minus');
					localStorage.setItem('basketProducts', JSON.stringify(basketItems));
					showBasket();
				}
			});

			plusBtn[i].addEventListener('click', () => {
				currentSum = plusBtn[i].parentElement.querySelector('span').textContent;
				currentProduct = plusBtn[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'');

				basketItems[currentProduct].count += 1;
				basketCount(basketItems[currentProduct]);
				totalSum(basketItems[currentProduct]);
				localStorage.setItem('basketProducts', JSON.stringify(basketItems));
				showBasket();
			});
		}
	}

	function removeBtn() {
		let removeBtn = document.querySelectorAll('.product-box .remove');
		let productCount = localStorage.getItem('basketCount');
		let cartSum = localStorage.getItem("totalSum");
		let basketItems = localStorage.getItem('basketProducts');
		basketItems = JSON.parse(basketItems);
		let productName;

		for(let i=0; i < removeBtn.length; i++) {
			removeBtn[i].addEventListener('click', () => {
				productName = removeBtn[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();

				localStorage.setItem('basketCount', productCount - basketItems[productName].count);
				localStorage.setItem('totalSum', cartSum - ( basketItems[productName].price * basketItems[productName].count));

				delete basketItems[productName];
				localStorage.setItem('basketProducts', JSON.stringify(basketItems));

				showBasket();
				onLoadBasketCount();
			})
		}
	}
	onLoadBasketCount();
	showBasket();
}
initCart();

function createOrder(amount, order_desc) {
	var button = $ipsp.get('button');
	button.setMerchantId(1396424);
	button.setAmount(amount, 'USD');
	button.setResponseUrl('http://example.com/result/');
	button.setHost('api.fondy.eu'); 
	button.addField({ label: 'Description', name: 'order_desc', value: order_desc }); 
	return button.getUrl(); 
}