jQuery(document).ready(function($){
	
	$(document).on("click", ".qtyControl", function(e) {
		e.preventDefault();
		
		var qtyField = $(this).closest(".col.qty").find("input");
		var current_qty = parseInt(qtyField.val()) || 0;

		if ($(this).hasClass("add")) {
			var qtyUpdate = current_qty < 10 ? (current_qty+1) : qty_limit(10); 
		} else if ($(this).hasClass("remove")) {
			var qtyUpdate = current_qty > 1 ? (current_qty-1) : 0;
		} else {
			var qtyUpdate = current_qty;
		}

		qtyField.val(qtyUpdate);

	});

	//on key out

	function qty_limit(limit){
		console.log("over limit");
		return limit;
	}

});


	
