const { ipcRenderer } = require("electron");
var billSan;
$(() => {
  ipcRenderer.on("billToF", (e, item) => {
    console.log(item);
    billSan = ++item[2];
    $(".setInvId").html("INV_" + billSan);
    $(".setDate").html(item[0].date);
    $(".billToName").html(item[0].name);
    $(".billToMobile").html(item[0].mobile);
    $(".billToAddress").html(item[0].address);

    let iddd = Object.keys(item[1]).length;
    console.log(item[1]);
    for (const [key, value] of Object.entries(item[1])) {
      $(".theadd").after(
        '<tr class="product-page">' +
          "<td>" +
          iddd-- +
          "</td>" +
          '<td colSpan="3">' +
          value.name +
          "</td>" +
          "<td>" +
          value.rate +
          "</td>" +
          "<td>" +
          value.qty +
          "</td>" +
          " <td>" +
          value.ttyl +
          "</td>" +
          "</tr>"
      );
    }
    $(".product-page td").css("padding", "5px 5px");
    $(".totalSum").html(item[3]);
  });

  $("#pdfC").click(() => {
    $(".theadd").removeClass("thead-dark");
    $("#pdfC").hide();
    ipcRenderer.send("print-to-pdf", billSan);
    window.print();
    setTimeout(() => {
      $("#pdfC").show();
    }, 2000);
  });
  $("#pdftohome").click(() => {
    ipcRenderer.send("btnEvent:pdftohome", "home");
  });
});
