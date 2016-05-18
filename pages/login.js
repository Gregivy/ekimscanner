var page2 = require("./scanner.js");

var iabSettings = 'hidden=no,clearcache=no,clearsessioncache=no';

var page = module.exports = new tabris.Page({
	title: "Ekim. Авторизация",
	topLevel: true
});

var logo = new tabris.ImageView({
	image: {src:"images/logo.jpg",scale:1},
	background: "rgb(255, 255, 255)",
	layoutData: {top: 0, left: 0, right: 0, height: 200}
}).appendTo(page);

var username = new tabris.TextInput({
	message: "Введите ваш логин",
	layoutData: {top: [logo,30], left: 0, right: 0}
}).appendTo(page);

var password = new tabris.TextInput({
	message: "Введите ваш пароль",
	layoutData: {top: [username,10], left: 0, right: 0}
}).appendTo(page);

var login = new tabris.Button({
	text: "Войти",
	layoutData: {centerX: 0, top: [password,10]}
}).appendTo(page);

function checksuccess() {
	var xhr = new tabris.XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === xhr.DONE) {
			var ref = cordova.InAppBrowser.open('http://ekim.ru', '_blank', iabSettings);
			ref.addEventListener('loadstop', function() {
    			ref.executeScript({code: xhr.responseText}, function(r) {
    				console.log(r);
    				ref.close();
    				if (r[0]=="success") {
    					console.log("we are here");
    					page2.open();
    					page.close();
    				} else {

    					textView.set("text", "Неверный логин или пароль!");
    				}
    			});
			});
		}
	}
	xhr.open("GET", "scripts/checklogin.js?"+Math.random());
	xhr.send();
}


var trg = true;
login.on("select", function() {
	var xhr = new tabris.XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === xhr.DONE) {
			var ref = cordova.InAppBrowser.open('http://ekim.ru', '_blank', iabSettings);
			ref.addEventListener('loadstop', function() {
				//console.log( xhr.responseText+"('"+username.get("text")+"','"+password.get("text")+"');");
    			if (trg) {
    				ref.executeScript({code: xhr.responseText+"('"+username.get("text")+"','"+password.get("text")+"');"}, function(r){
    					console.log(r);
    					if (r[0] == "success") {
    						ref.close();
    						page2.open();
    						page.close();
    					} else {
    						trg = false;
    					}
    				});
    			} else {
    				trg = true;
    				ref.close();
	    			window.setTimeout(checksuccess,100);
    			}
			});
		}
	}
	xhr.open("GET", "scripts/login.js?"+Math.random());
	xhr.send();
	
});

var textView = new tabris.TextView({
  font: "24px",
  layoutData: {centerX: 0, top: [login, 20]}
}).appendTo(page);