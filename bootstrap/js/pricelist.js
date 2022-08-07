const {ipcRenderer}=require('electron');
var Sno=0;
ipcRenderer.on('serviceList',(e,data)=>{
    let last=data.pop();
    data.forEach((element)=>{
        Sno+=1;
        let option="<tr id="+element.serviceCodepl+"><td>SV-"+element.serviceCodepl+"</td><td>"+element.serviceNamepl+"</td><td>"+element.price+"</td><td><button class='btn action' value='"+element.serviceCodepl+"'><img src='../Resources/icons/del.png' style='max-width: 18px;'></button></td></tr>";
        $("tbody").append(option);
    });
    if(last=="end"){

    }else{
        $("#success-msg").html("Record Added !");
        $("#service").val('');
        $("#price").val('');
        $(".header").show();
        setTimeout(()=>{
            $(".header").hide();
        },3000);
    }
    $("#stats").html(Sno);
});

$(()=>{
    $(".header").hide();
    $("#add").click(()=>{
        let name=$("#service").val();
        let price=$("#price").val();
        if(name==""||price==""){
            $("#success-msg").html("Fields cannot be empty!");
            $(".header").show();
            setTimeout(()=>{
                $(".header").hide();
            },3000);
            return false;
        }
        let obj={
            name:name,
            price:price
        }
        ipcRenderer.send('AddValuesToDBPL',obj);
    });


    $("#searchServices").keyup(function(){
        var value = $(this).val().toLowerCase();
        $("tbody>tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#homebtnp").click(()=>{
        ipcRenderer.send('open-home-window');
    });
});

$(document).on('click', '.action', function() {
    let vall=$(this).val();
    $(this).parent().parent().remove();
    ipcRenderer.send("updatePriceList",vall);
    // console.log("to be deleted id"+vall);
});

ipcRenderer.on('updatePriceList:True',(e,data)=>{
    $("#stats").html(--Sno);
    $("#success-msg").html("Entry Deleted");
    $(".header").show();
    setTimeout(()=>{
        $(".header").hide();
    },3000);
});