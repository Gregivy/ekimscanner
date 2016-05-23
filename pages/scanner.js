var openItem = require("./item.js");
var makeOrder = require("./order.js");

var openPage = module.exports = function () {
	//switchBusy();

	function blockUI() {
		page.find("Button").set('enabled',false);
		//scanButton.set('enabled',false);
		activityIndicator.set('visible', true);
	}

	function unblockUI() {
		page.find("Button").set('enabled',true);
		activityIndicator.set('visible',false);
	}

	var iabSettings = 'hidden=yes,clearcache=no,clearsessioncache=no';

	var page = new tabris.Page({
		title: "Ekim. Сканнер штрих-кодов",
		topLevel: false
	});

	/*var openPage = module.exports = function () {
		//switchBusy();
		blockUI();
		page.open();
		window.setTimeout(checkCart,100);
	}*/

	var scanButton = new tabris.Button({
		text: "Сканнировать штрих-код",
		layoutData: {centerX: 0, top: 10}
	}).appendTo(page);

	var cartTitle = new tabris.TextView({
	  font: "24px",
	  text: "Ваша корзина",
	  layoutData: {left: 5, top: [scanButton, 10]}
	}).appendTo(page);

	var item = {
		imgurl:'',
		name: '',
		price: ''
	}

	var orderButton = new tabris.Button({
		text: "Оформить заказ",
		layoutData: {centerX: 0, bottom: 0}
	}).appendTo(page);

	orderButton.on("select", function () {
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				console.log(xhr.responseText);
				var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_target', 'hidden=no,location=no,zoom=yes');

				
			}		
		}
		xhr.open("GET", "css/order.css?_="+Math.random());
		xhr.send();
		//var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_blank', 'location=no,zoom=no');
		//ref.insertCSS({file:"css/order.css"});
	})

	var scrollViewSettings = {
		  left: 30, right: 0, top: [cartTitle, 5], bottom: [orderButton,5],
		  direction: "vertical",
		  background: "#ffffff"
	}

	var scrollView = new tabris.ScrollView(scrollViewSettings).appendTo(page);

	var activityIndicator = new tabris.ActivityIndicator({
	  centerX: 0,
	  centerY: 0,
	  visible: false
	}).appendTo(page);


	function rebuildCart(items) {
		if (scrollView.children().length>0) scrollView.children().dispose();
		//scrollView = new tabris.ScrollView(scrollViewSettings).appendTo(page);

		items.forEach(function(item,i) {
			var children = scrollView.children();
			var newitem_top = children.length > 0 ? [children[children.length-1],5] : 0;
			var newitem = new tabris.Composite({
		    	layoutData: {left:2, right:2, top: newitem_top}
		   	}).appendTo(scrollView);


			var deleteButton = new tabris.Button({
				text: "Удалить",
				layoutData: {right:0, top: 0}
			}).appendTo(newitem);

			var name = new tabris.TextView({
				font: "16px",
				text: item.name,
				layoutData: {left: 2, top: 0, right: [deleteButton,5]}
			}).appendTo(newitem);

			var price = new tabris.TextView({
				font: "10px",
				text: item.price,
				layoutData: {left: 2, top: [name, -10]}
			}).appendTo(newitem);

			var hr = new tabris.Composite({
				layoutData: {left: 0, right: 0, top: [price, 2], height:1},
				background: "#000000"
			}).appendTo(newitem);


			deleteButton.trg = true;

			deleteButton.on("select", function() {
				blockUI();
				var xhr = new tabris.XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState === xhr.DONE) {
						var ref = cordova.InAppBrowser.open('http://ekim.ru/baskets', '_blank', iabSettings);
						ref.addEventListener('loadstop', function(e) {
							console.log(xhr.responseText+"('"+item.deletelink+"');");
							if (deleteButton.trg) {
								ref.executeScript({code: xhr.responseText+"('"+item.deletelink+"');"});
								deleteButton.trg = false;
							} else {
								unblockUI();
								ref.close();
								deleteButton.trg = true;
								checkCart();
							}
							//ref.close();
							
							console.log(e.url);
						});
					}		
				}
				xhr.open("GET", "scripts/deleteitem.js?_="+Math.random());
				xhr.send();
			});
		});
	}

	function checkCart() {
		//console.log("here");
		blockUI();
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				var ref = cordova.InAppBrowser.open('http://ekim.ru/baskets', '_blank', iabSettings);
				ref.addEventListener('loadstop', function(e) {
		    		ref.executeScript({code: xhr.responseText}, function(r) {
		    			console.log(r);
		    			rebuildCart(r[0]);
		    			unblockUI();
		    			if (r[0].length==0) {
		    				orderButton.set('enabled',false);
		    			}
		    			//switchBusy();
		    			ref.close();
		    		});
				});
			}
		}
		xhr.open("GET", "scripts/cartcheck.js?_="+Math.random());
		xhr.send();
	}

	function searchonsite(text) {
		blockUI();
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				var ref = cordova.InAppBrowser.open('http://ekim.ru/price_items/search?oem='+text, '_blank', iabSettings);
				ref.addEventListener('loadstop', function(e) {
					console.log(e.url);
					if (e.url.indexOf("price")>-1) {
		    			item.price = decodeURIComponent(e.url.split("=")[1]);
		    			ref.close();
		    			console.log(item);
		    			//page.close();
		    			unblockUI();
		    			openItem(item,text,checkCart);
		    			//console.log(e.url.split("=")[1]);
		    		} else if (e.url.indexOf("/NOBRAND/")>-1) {
		    			console.log("no item found");
		    			navigator.notification.alert(
		    				"К сожалению ничего не найдено! Распознанный код:"+text,
		    				function () {},
		    				"Ошибка!",
		    				"Продолжить"
		    			);
		    			ref.close();
		    			unblockUI();
		    			//switchBusy();
		    		} else {
		    			ref.executeScript({code: xhr.responseText}, function(r) {



		    				console.log(r);

		    				item.imgurl = r[0][0];
		    				item.name = r[0][1];
		    				/*ref.close();
		    				if (r[0]=="success") {
		    					console.log("we are here");
		    					page2.open();
		    					page.close();
		    				} else {

		    					textView.set("text", "Неверный логин или пароль!");
		    				}*/
		    			});
		    		}
				});
			}
		}
		xhr.open("GET", "scripts/search.js?_="+Math.random());
		xhr.send();
	}

	scanButton.on("select", function() {
		cordova.plugins.barcodeScanner.scan(
	      	function (result) {
	    		if	(!result.cancelled) {
	    			console.log(result.format,result.text);
	    			//switchBusy();
	    			searchonsite(result.text);
	    		}
	      	}, 
	      	function (error) {
	        	console.log("Scanning failed: " + error);
	      	},	
	      	{
	          "preferFrontCamera" : true, // iOS and Android 
	          "showFlipCameraButton" : true, // iOS and Android 
	          "prompt" : "Place a barcode inside the scan area", // supported on Android only 
	          //"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
	          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device 
	      	}
	   );
	});

	blockUI();
	page.open();
	window.setTimeout(checkCart,100);
}