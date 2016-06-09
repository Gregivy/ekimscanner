var openItem = require("./item.js");

var openPage = module.exports = function () {
	//switchBusy();

	function blockUI() {
		page.find("Button").set('enabled',false);
		//scanButton.set('enabled',false);
		activityIndicator.set('visible', true);
	}

	function unblockUI() {
		page.find("Button").set('enabled',true);
		if (scrollView.children().length == 0) {
			orderButton.set('enabled',false);
		}
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
		textColor: "#ffffff",
		background: "#217aba",
		layoutData: {left:50, right: 50, top: 10, height:60}
	}).appendTo(page);

	var cartTitle = new tabris.TextView({
	  font: "28px",
	  markupEnabled: true,
	  text: "<b>Ваша корзина</b>",
	  layoutData: {left: 20, top: [scanButton, 10]}
	}).appendTo(page);

	var item = {
		imgurl: '',
		name: '',
		price: ''
	}

	var orderButton = new tabris.Button({
		text: "Оформить заказ",
		background: "#32cd32",
		textColor: "#ffffff",
		layoutData: {left:50, right:50, bottom: 20, height:60}
	}).appendTo(page);

	orderButton.on("select", function () {
		/*fetch("./scripts/deleteitem.js",{method:"get",cache:"no-cache"}).then(function(response) {
  			return response.text();
		}).then(function(text) {

		});
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				console.log(xhr.responseText);
				var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_target', 'hidden=no,location=no,zoom=yes');

				
			}		
		}
		xhr.open("GET", "css/order.css?_="+Math.random());
		xhr.send();*/
		var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_target', 'hidden=no,location=no,zoom=yes');
		//var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_blank', 'location=no,zoom=no');
		//ref.insertCSS({file:"css/order.css"});
	})

	var scrollViewSettings = {
		  left: 0, right: 0, top: [cartTitle, 10], bottom: [orderButton,5],
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
		    	layoutData: {left:20, right:20, top: newitem_top}
		   	}).appendTo(scrollView);


			var deleteButton = new tabris.Button({
				background: "red",
				image: "images/trash.png",
				layoutData: {right:0, top: 0, width: 50}
			}).appendTo(newitem);

			var name = new tabris.TextView({
				font: "12px",
				text: item.name,
				layoutData: {left: 2, top: 0, right: [deleteButton,5]}
			}).appendTo(newitem);

			var price = new tabris.TextView({
				font: "12px",
				markupEnabled: true,
				text: "<b>"+item.price+"</b>",
				layoutData: {left: 2, top: [name, -10]}
			}).appendTo(newitem);

			var hr = new tabris.Composite({
				layoutData: {left: 0, right: 0, top: [deleteButton, 2], height:1},
				background: "#ebebeb"
			}).appendTo(newitem);


			deleteButton.trg = true;

			deleteButton.on("select", function() {
				navigator.notification.confirm(
    				'Вы действительно хотите убрать этот товар из корзины?',  // message
    				function (i) {
    					if (i == 1) {
    						blockUI();
							newitem.set("background","#cccccc");
							fetch("./scripts/deleteitem.js",{method:"get",cache:"no-cache"}).then(function(response) {
				  				return response.text();
							}).then(function(text) {
								var ref = cordova.InAppBrowser.open('http://ekim.ru/baskets', '_blank', iabSettings);
								ref.addEventListener('loadstop', function(e) {
									console.log(text+"('"+item.deletelink+"');");
									if (deleteButton.trg) {
										ref.executeScript({code: text+"('"+item.deletelink+"');"});
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
							});
    					}
    				},
    				'Предупреждение',            // title
    				['Да','Отмена']            // buttonLabels
				);
			});
		});
	}

	function checkCart() {
		//console.log("here");
		blockUI();
		fetch("./scripts/cartcheck.js",{method:"get",cache:"no-cache"}).then(function(response) {
	  		return response.text();
		}).then(function(text) {
			var ref = cordova.InAppBrowser.open('http://ekim.ru/baskets', '_blank', iabSettings);
			ref.addEventListener('loadstop', function(e) {
		   		ref.executeScript({code: text}, function(r) {
		   			console.log(r);
		   			rebuildCart(r[0]);
		   			unblockUI();
		   			//switchBusy();
		   			ref.close();
		   		});
			});
		});
	}

	function searchonsite(article) {
		blockUI();
 
		fetch("http://ekim.ru/price_items/search?oem="+article).then(function(response1){
			return response1.text();
		}).then(function (text) {
			console.log(text.indexOf('<h1 class="main-title">Nobrand'));
			if (text.indexOf('<h1 class="main-title">Nobrand')==-1) {
				console.log("get/text");
				var pricefetch = function () {
					fetch("http://ekim.ru/products/price.json?oem="+article, {
						method: "post",
						mode: "no-cors",
						redirect: "follow",
						headers: {
							'Accept': '*/*',
							'Content-Type': 'application/json'
						}
					}).then(function(response){
						console.log(response.status);
						return response.json();
					}).catch(function(err) {
						//pricefetch();
						console.log(err);
						//return false;
					}).then(function(json){
						if (json!==false) {
							unblockUI();
							console.log(json);
							var title = json["original_prices"]["data"][0]["detail_name"];
							var cost = json["original_prices"]["data"][0]["cost"];
							var imgurl = text.split('" class="lightbox fancybox"')[0].split('<a href="')[1];
							console.log({imgurl: imgurl, name: title, price: cost});
							openItem({imgurl: "http://ekim.ru/"+imgurl, name: title, price: cost},article,checkCart);
						}
					});
				};
				fetch("http://ekim.ru/").then(function(response1){
					return response1.text();
				}).then(function (text) {
					console.log(text);
				});
				//pricefetch();
			} else {
				unblockUI();
				navigator.notification.alert(
	   				"К сожалению ничего не найдено! Распознанный код:"+article,
	   				function () {},
	    			"Ошибка!",
		   			"Продолжить"
		  		);
			}
		});
		/*fetch("./scripts/search.js",{method:"get",cache:"no-cache"}).then(function(response) {
	  		return response.text();
		}).then(function(text) {
			var ref = cordova.InAppBrowser.open('http://ekim.ru/price_items/search?oem='+article, '_blank', iabSettings);
			ref.addEventListener('loadstop', function(e) {
				console.log(e.url);
				if (e.url.indexOf("price")>-1) {
	    			item.price = decodeURIComponent(e.url.split("=")[1]);
		   			ref.close();
		   			console.log(item);
		   			//page.close();
		   			unblockUI();
		   			openItem(item,article,checkCart);
	    			//console.log(e.url.split("=")[1]);
		   		} else if (e.url.indexOf("/NOBRAND/")>-1) {
		   			console.log("no item found");
		   			navigator.notification.alert(
		   				"К сожалению ничего не найдено! Распознанный код:"+article,
	    				function () {},
	    				"Ошибка!",
		   				"Продолжить"
		  			);
		   			ref.close();
		   			unblockUI();
		    		//switchBusy();
		    	} else {
		    		ref.executeScript({code: text}, function(r) {
		    			console.log(r);
		    			item.imgurl = r[0][0];
		    			item.name = r[0][1];
		   			});
		   		}
			});
		});*/
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
	          "prompt" : "Поместите штрих-код внутрь сканируемой области", // supported on Android only 
	          //"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
	          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device 
	      	}
	   );
	});

	//blockUI();
	page.open();
	//window.setTimeout(checkCart,100);
}