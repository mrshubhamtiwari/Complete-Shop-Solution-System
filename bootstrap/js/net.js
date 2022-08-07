const {ipcRenderer}=require('electron');

function updateStatus() {
    $.ajax({
        url: "https://www.google.com",
        method: "HEAD",
        timeout:2000,
        success: () => {
            // $("#status").html("online");
            ipcRenderer.send("Online");
        },
        error: () => {
            $("#status").html("offline");
            setTimeout(()=>{
                updateStatus();
            },2000);
        }
    });
}

window.addEventListener('online',updateStatus);
window.addEventListener('offline',updateStatus);
updateStatus();