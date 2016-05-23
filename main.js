//new tabris.Drawer().append(new tabris.PageSelector());


Promise = require("promise");
require("whatwg-fetch");

document.addEventListener("offline", function () {
	navigator.notification.alert(
  		"Проверьте подключение к интернету!",
	   	function () {
	 		tabris.app.reload();
	    },
	 	"Ошибка!",
		"Продолжить"
  	);
}, false);

var page = require("./pages/login.js").open();
//var page2 = require("./pages/scanner.js");