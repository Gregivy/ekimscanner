var page = new tabris.Page({
  title: "Ekim сканнер штрих-кодов",
  topLevel: true
});

var button = new tabris.Button({
  text: "Native Widgets",
  layoutData: {centerX: 0, top: 100}
}).appendTo(page);

var label = new tabris.TextView({
  font: "24px",
  layoutData: {centerX: 0, top: [button, 50]}
}).appendTo(page);

button.on("select", function() {
  label.set("text", "Totally Rock!");
});

page.open();