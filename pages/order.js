var page = new tabris.Page({
	title: "Ekim. Оформление заказа",
	topLevel: true
});

var openPage = module.exports = function () {
	//switchBusy();
	page.open();
	//window.setTimeout(checkCart,100);
}

var delType = new tabris.TextView({
  font: "14px",
  text: "Вид доставки",
  layoutData: {left: 5, top: 20}
}).appendTo(page);