(function(){
	
	//goto http://ekim.ru/price_items/search?oem=4601313002291
	//$("input[name='oem']").val(article);
	setInterval(function() {
		if ($('.price').length>0) {
			//return ($('.price').text()).trim();
			$(".bay").click();
			$(".basket-form-submit").click();
			location.replace('http://ekim.ru/?added2cart=true');
		}
	}, 500);
})();