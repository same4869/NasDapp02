$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1xe9kapHn2FABVUPU7CULCk4ntBYjhdPVC";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;

    $("#activityTime").datetimepicker({  
        format: 'YYYY-MM-DD',  
        locale: moment.locale('zh-cn')  
    });

    $("#submitcontact").on("click", function(event) {
        var date = $("#activityTime").val();
        var title = $("#activityName").val();
        var content = $("#activityContent").val();
        console.log(date, title, content);
        addANew(date, title, content);
    });
    function addANew(date,title,content){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "addANew";
        var callArgs = "[\"" + date + "\",\"" + title + "\",\"" + content + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                        if(resp.indexOf("Transaction rejected by user") > 0){
                            alert("您拒绝了合约调用，请重试");
                        }
                        //upadte card status into in progress...
                }
        }); 
    }

})