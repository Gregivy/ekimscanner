(function () {
	var items = [];
	$(".tab-bask tr").each(function(i,v){
		if (i>0) {
			var name = $($(v).find("td")[2]).contents().filter(function() {return this.nodeType === 3;}).text();
			var price = $(v).find(".price").text();
			var deletelink = $(v).find(".delete").attr("href");
			items.push({name:name,price:price,deletelink:deletelink});
		}
	});
	return items;
})();