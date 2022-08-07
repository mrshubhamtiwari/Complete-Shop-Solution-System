const {ipcRenderer}=require('electron')
$(()=>{
    $(".header").hide();
    $("#loginForm").submit((event)=>{
        event.preventDefault();

        var uname=$("#username").val();
        var pwd=$("#password").val();
        var login={
            uname:uname,
            pswd:pwd
        }
        ipcRenderer.send('logData',login);

    });
});
ipcRenderer.on('error:auth',(e,item)=>{
    $("#error-msg").html("Invalid Username or Password.");
    $(".header").show();
    setTimeout(()=>{
        $(".header").hide();
    },3000);
});

ipcRenderer.on('error:db',(e,item)=>{
    $("#error-msg").html("Database Connection Failed! Try Connecting to your Database.");
    $(".header").show();
    setTimeout(()=>{
        $(".header").hide();
    },8000);
});
