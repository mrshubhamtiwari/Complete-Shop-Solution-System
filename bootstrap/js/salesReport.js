const {ipcRenderer}=require('electron');
var Sno=0;
var amount=0;
ipcRenderer.on('Sales:Report',(e,data)=>{
    let last=data.pop();
    data.forEach((element)=>{
        Sno+=1;
        amount+=Number(element.price);
        let option="<tr id="+element.invoiceno+"><td>"+Sno+"</td><td>"+element.date+"</td><td>INV_"+element.invoiceno+"</td><td>"+element.customerName+"</td><td>"+element.mobile+"</td><td>"+element.address+"</td><td>"+element.price+"</td></tr>";
        $("tbody").append(option);
    });
    $("#statsSales").html(amount);
});

$(()=>{
    $(".header").hide();
    $("#searchServices").keyup(function(){
        var value = $(this).val().toLowerCase();
        $("tbody>tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#homebtnp").click(()=>{
        ipcRenderer.send('open-home-window-sales');
    });
});
