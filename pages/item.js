var initItem = module.exports = function (item,url,checkCart) {

	var iabSettings = 'hidden=yes,clearcache=no,clearsessioncache=no';

	function switchBusy() {
		add2cart.set('enabled',!add2cart.get('enabled'));
		activityIndicator.set('visible',!activityIndicator.get('visible'));
	}

	var page = new tabris.Page({
		title: "Описание товара",
		topLevel: false
	});

	var activityIndicator = new tabris.ActivityIndicator({
  		centerX: 0,
  		centerY: 0,
  		visible: false
	}).appendTo(page);

	var img = new tabris.ImageView({
		image: {src:"http://ekim.ru"+item.imgurl,scale:1},
		background: "rgb(255, 255, 255)",
		scaleMode: "fill",
		layoutData: {top: 0, left: 0, right: 0, height: 200}
	}).appendTo(page);

	var name = new tabris.TextView({
		font: "24px",
		text: item.name,
		layoutData: {centerX: 0, top: [img, 20]}
	}).appendTo(page);

	var price = new tabris.TextView({
		font: "24px",
		text: item.price,
		layoutData: {centerX: 0, top: [name, 20]}
	}).appendTo(page);	

	var add2cart = new tabris.Button({
		text: "Добавить в корзину",
		layoutData: {centerX: 0, top: [price,10]}
	}).appendTo(page);

	add2cart.on("select", function() {
		switchBusy();
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				console.log(xhr.responseText);
				var ref = cordova.InAppBrowser.open('http://ekim.ru/price_items/search?oem='+url, '_blank', iabSettings);
				ref.addEventListener('loadstop', function(e) {
					//console.log( xhr.responseText+"('"+username.get("text")+"','"+password.get("text")+"');");
	    			if (e.url.indexOf("added2cart=true") == -1) {
	    				ref.executeScript({code: xhr.responseText});
	    			} else if (e.url.indexOf("added2cart=true") > -1) {
	    				//switchBusy();	
	    				ref.close();
		    			page.close();
		    			checkCart();
	    			} else {
	    				switchBusy();
	    			}
				});
			}
		}
		xhr.open("GET", "scripts/add2cart.js");
		xhr.send();	
	});

	page.open();
}
