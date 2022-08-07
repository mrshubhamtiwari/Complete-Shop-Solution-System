const {ipcRenderer}=require('electron')
var ssum=0;
var keys=[];
var invid;
var totalCart= [];
$(()=>{
    $("#billgenerror").hide();

    $("#plist").change(()=>{
        console.log("value from option ->"+$("#plist").val())
        ipcRenderer.send("select:change",$("#plist").val());
        $("#rate").val('0');
        $("#quant").val('0');
        $("#total").val('0');
    });

    $("#quant").change(function(){
        sum=Number($(this).val())*Number($("#rate").val());
        $("#total").val(sum);
    });
    id=1
    $("#atm").click(()=>{

        let name=$("#plist option:selected").text();
        let svcode=$("#plist").val();
        let rate=$("#rate").val();
        let qnt=$("#quant").val();
        let ttl=$("#total").val();
        if(qnt=='0'||qnt==0||svcode=='0'){
            $("#billgenerror-text").html("Quantity Cannot be Zero");
            $("#billgenerror").show();
            setTimeout(()=>{
                $("#billgenerror").fadeOut();
            },3000);
            return false;
        }
        if(totalCart[svcode]){
            $("#billgenerror-text").html("Record Alreay Added!");
            $("#billgenerror").show();
            setTimeout(()=>{
                $("#billgenerror").fadeOut();
            },3000);
            return false;
        }

        totalCart[svcode]={
            name:name,
            rate:rate,
            qty:qnt,
            ttyl:ttl,
            svcode:svcode

        };
        console.log(totalCart);

        ssum=ssum+Number(ttl);
        $("#sumtotal").val(ssum);
        $("tbody").append("<tr id="+svcode+">"+
            "<td>"+(id++)+"</td>"+
            "<td>"+name+"</td>"+
            "<td>"+rate+"</td>"+
            "<td>"+qnt+"</td>"+
            "<td>"+ttl+"</td>"+
            "<td><button class='action btn p-1' id='"+svcode+"' value="+ttl+"><img src='../Resources/icons/del.png' style='max-width: 20px;'></button></td>"+
            +"</tr>");

    });

    //Genreate Data script
    let date;
    var datee=new Date();
    if(datee.getDate()<10){
        date="0"+datee.getDate();
    }else{
        date=datee.getDate();
    }
    if(datee.getMonth()<10){
        date=date+"/0"+datee.getMonth()+"/"+datee.getFullYear();
    }else{
        date=date+"/"+datee.getMonth()+"/"+datee.getFullYear();
    }

    $("#dateid").val(date);

    const {ipcRenderer}=require('electron');
    ipcRenderer.on('serviceList',(e,data)=>{
        invid=data[0];
        data=data[1];
        data.forEach((element)=>{
            let option="<option value="+element.serviceCodepl+">SV-"+element.serviceCodepl+"-"+element.serviceNamepl+"</option>";
            $("#plist").append(option);
        });
    });

    ipcRenderer.on("select:price",(e,item)=>{
        console.log("fetched price : "+item);
        $("#rate").val(item);
        $("#quant").attr('readonly',false);
    });

    $("#gobill").hover(function(){
        $(this).css("cursor","pointer");
    });


    $("#gobill").click(function(event){
        var bname=$("#bname").val();
        var mob=$("#mob").val();
        var pattrn=/(([0-9]){10})/;
        var res;
        var addr=$("#addr").val();
        if(bname=="" || mob=="" || addr==""){
            $("#billgenerror-text").html("Error, Empty Fields For Customer");
            $("#billgenerror").show();
            setTimeout(()=>{
                $("#billgenerror").fadeOut();
            },3000);
            return false;
        }else{
            if(pattrn.test(mob)==false){
                $("#billgenerror-text").html("Error,Invalid Mobile Number");
                $("#billgenerror").show();
                setTimeout(()=>{
                    $("#billgenerror").fadeOut();
                },3000);
                return false;
            }else{
                let user={
                    name:bname,
                    mobile:mob,
                    address:addr,
                    date:date
                };
                ipcRenderer.send("billTo",[user,totalCart,invid,ssum]);
            }
        }
    });
    $("#mob").keyup(function(){
        var len=$(this).val().length;
        if(len>10){
            $("#mob-error").html("<span style='color:red'>Mobile No. cannot Exceed more than 10 Digits<span>");
        }else if(len<10 && len>0){
            $("#mob-error").html("<span style='color:red'>Invalid Mobile Number</span>");
        }else if(len==10){
            $("#mob-error").html("");
        }else if(len==0){
            $("#mob-error").html("");
        }
    });
});

$(document).on('click', '.action', function() {
    var xx=$(this).attr('id');
    delete totalCart[xx];
    // console.log(totalCart);
    let vall=$(this).val();
    ssum-=Number(vall)
    $(this).parent().parent().remove();
    $("#sumtotal").val(ssum);
});
$("#homebtn").click(()=>{
    ipcRenderer.send("btnEvent:home","home");
});