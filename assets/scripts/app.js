//check initial checkout values and write to totals
window.onload = function () { 
	check_initial_totals(1); 
};

jQuery(document).ready(function($){
	
	//function on click qty stepper
	$(document).on("click", ".qtyControl", function(e) {
		e.preventDefault();
		//find input in qty group
		var qtyField = $(this).closest(".qty-group").find("input");
		//get initial value or sets to 0
		var current_qty = parseInt(qtyField.val()) || 0;
		//find product row
		var product = $(this).closest(".product");
		//qty control step
		var changeValue = 1;

		//display currency if not showing (first product iteration case)
		if(product.find(".subtotal .currency").is(":hidden")){ product.find(".subtotal .currency").show();}

		//check if stepper is sum
		if ($(this).hasClass("add")) {
			if($(this).prev().prev().hasClass("min-reach")){
				$(this).prev().prev().removeClass("max-reach");
				$(this).prev().prev().attr("disabled",false);
			}			
			if(current_qty==10){
				$(this).addClass("max-reach").attr("disabled","disabled");
				qty_limit(10,product.attr("id"));
			}else{
				//add 1 or stop in 10
				qtyUpdate = current_qty < 10 ? (current_qty+changeValue) : qty_limit(10,product.attr("id")); 
				//update row price
				update_price(product,qtyUpdate);
				unit_price = product.find(".price").data("price");
				//update totals
				update_order_totals(unit_price,'plus');
			}
			

		//check if stepper is subtraction
		} else if ($(this).hasClass("remove")) {
			if($(this).next().next().hasClass("max-reach")){
				$(this).next().next().removeClass("max-reach");
				$(this).next().next().attr("disabled",false);
				$(this).closest(".qty").find(".warning").remove();
			}
			if(current_qty==0){
				$(this).addClass("min-reach").attr("disabled","disabled");
			}else{
				//remove 1 or stop in 0
				qtyUpdate = current_qty > 1 ? (current_qty-changeValue) : 0;
				//update row price
				update_price(product,qtyUpdate);
				unit_price = product.find(".price").data("price");
				//update totals
				update_order_totals(unit_price,'minus');
			}


			
			

		//default case
		} else {
			qtyUpdate = current_qty;
		}

		//update the product row input value
		qtyField.val(qtyUpdate);

	});

	//remove product
	$(document).on("click", ".removeProduct", function(e){
		e.preventDefault();
		var rowProductId = $(this).closest(".product").attr("id");
		remove_product(rowProductId);

	});

	//click checkout
	$(document).on("click", ".checkoutBtn", function(e){
		e.preventDefault();
		//get all products
		$(".product").each(function(){
			var product = {
				product_id : $(this).data("id"),
        		product_name : $(this).find("p .product-name").text(),
        		product_price : $(this).find(".price").data("price"),
        		product_qty : $(this).find(".qty").find("input[name='qty']").val(),
        		product_row_subtotal : $(this).find(".subtotal").find(".row-subtotal").text()
			};
			//display products in console when checkout button is clicked
			console.log(product);
	
		$("#products-list").addClass("closed");
		$("html, body").animate({ scrollTop: 0 }, "slow", function(){
			$(".notices").addClass("green").html("Thank you for your order. Please proceed to the next step.");	
		});
		
        	
    	});
	});

	//on key out ToDO
	/*
	Add a way for all the checks to be done with user input
	*/

});

function qty_limit(limit,product_id){
	console.log("over limit");
	//display customer notice
	var product_row = document.getElementById(product_id);
	var someElement = product_row.getElementsByClassName("product-removal")[0];

	if(!document.getElementById("warning")){
		var newElement = document.createElement("div");
		newElement.setAttribute("class", "warning");
		var text = document.createTextNode("You can only order 10 units.");
		newElement.appendChild(text); 
		someElement.parentNode.insertBefore(newElement, someElement.nextSibling);
	}
	//setTimeout(function(){remove('warning',0);}, 2000);	

	return limit;
}

function remove_product(id){
	console.log("product removed");
	//remove product
	remove(id,1);
	//update totals
	var product_row = document.getElementById(id);
	var product_subtotal = product_row.getElementsByClassName("row-subtotal")[0].innerHTML;
	console.log(product_subtotal);
	update_order_totals(product_subtotal,'minus');
	var n_products = document.querySelectorAll('.product').length;
	if(n_products<=1){
		document.getElementById("checkout-btn").disabled = true;
		smoothscroll();

		var element_notices = document.getElementById("notices");
		var text = document.createTextNode("You have no products in your basket.");

		element_notices.setAttribute("class", "notices red");
		element_notices.appendChild(text); 	


	}
	console.log(n_products);
}

function check_initial_totals(initial){
	var subtotal = 0;
	var products = document.getElementsByClassName('product');

	//loop through all products in document
	for(var i = 0; i < products.length; i++){
		var product = products.item(i);
		//get product quantity in row
		var qty = product.querySelector('input').value;

		if(qty>0){
			//get product price
			var price = product.getElementsByClassName('price')[0].getAttribute('data-price');
			var rowSubtotal = qty*price;

			//store in order subtotal
			subtotal = subtotal+rowSubtotal;

			//write to row only in initial iteration
			if(initial==1){
				product.getElementsByClassName('row-subtotal')[0].innerHTML = money(rowSubtotal);
				product.getElementsByClassName('currency')[0].style.display = 'inline-block';
			}

		}
   			
	}

	update_order_totals(subtotal);

  	//remove loader screen
	setTimeout(function(){remove('loading',0);}, 1000);	

}

function update_order_totals(subtotal,direction){
	var current_value = document.getElementById('order-subtotal').innerHTML || 0;
	var new_total = 0;

	if(direction=="plus"){
		new_total = str2number(current_value) + subtotal;
	}else if(direction=="minus"){
		new_total = str2number(current_value) - str2number(subtotal);
	}else{
		new_total = subtotal;
	}

	document.getElementById('order-subtotal').innerHTML = money(new_total);
	var vat = new_total*0.2;
	document.getElementById('order-vat').innerHTML = money(vat);
	document.getElementById('order-total').innerHTML = money(vat+new_total);
	var currencySpan = document.getElementsByClassName('currency');
  	for(i=0; i<currencySpan.length; i++) {
    	currencySpan[i].style.display = 'inline-block';
  	}
}

//update row price
function update_price(element,qty){
	priceUpdate = parseInt(element.find(".price").data("price"))*qty;
	element.find(".subtotal span+span").html(money(priceUpdate));
}

//format money number
function money(number){
	var money = Number(number).toLocaleString("en", {minimumFractionDigits: 2});
	return money;
}

//remove element by id
function remove(id,fade) {
 	var element = document.getElementById(id);
 	if(fade==1){
 	 	element.style.opacity = '0';
		setTimeout(function(){element.remove();}, 500);	
 	}else{
 		element.remove();
 	}

}

//fix Locale string sum issue
function str2number(n){

	var new_number = n.toString().replace(',', '');

	return parseFloat(new_number);

}

//Scroll to Top Javascript
function smoothscroll(){
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
}