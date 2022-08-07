$(()=>{
    const {ipcRenderer}=require('electron');

    ipcRenderer.on('logUser',(e,item)=>{
        $("#dropdownbtn .dcontent").html("Welcome "+item);
    });

    $("#billGenerate").click(()=>{
        ipcRenderer.send("bill-btn-click","clicked");
    });

    $("#AddItem").click(()=>{
        ipcRenderer.send("item-btn-click","clicked");
    });
    $("#Summary").click(()=>{
        ipcRenderer.send("sales-btn-click","clicked");
    });


    $("#search").keyup(function(){
        var value = $(this).val().toLowerCase();
        $(".card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
    $("#dropdownbtn").click(()=>{
        $("#myDDN").toggle('display');
    });
    $("#logout").click(()=>{
        ipcRenderer.send("logout");
    });

    $(document).on('mouseover', '.home-glyph', function() {
        let text=$(this).attr('alt');
        $("#serviceText").html(text);
    });

});