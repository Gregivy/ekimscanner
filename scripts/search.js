(function(){
	//goto http://ekim.ru/price_items/search?oem=4601313002291
	//$("input[name='oem']").val(article);
	setInterval(function() {
		if ($('.price').length>0) {
			//return ($('.price').text()).trim();
			location.replace('http://ekim.ru/?price='+($('.price').text()).trim());
		}
	}, 500);
	var img = $('.wrap-d-slider img').attr("src");
	var title = $('.main-title').html();
	//var price = ($('.price').text()).trim();
	return [img,title];
})();