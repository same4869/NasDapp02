$(function() {    
    var pageId = window.location.search.split("=")[1];
    console.log(pageId);
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

    function getById(pageId){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getInfo";
        var callArgs = "[\"" + pageId + "\"]";
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
        neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            var result = resp.result;   
            console.log("result : " + result);
            result = JSON.parse(result);
            var id = (pageId + 1) % 30;
            var html = "";
            var otherListHtml = '';
            for( var i = 0; i < result[0].otherManList.length; i++) {
                otherListHtml += '<div class="bottom-item">' +
                                    '<span class="user f-right">参与者： <a href="#">'+result[0].otherManList[i]+'</a><img src="images/ava-1.jpg"></span>' +
                                '</div>' ;
            }
            html = '<div class="container">' +
                        '<center><article>' +
                            '<a class="example-image-link" href="images/'+ id +'.jpg" data-lightbox="example-set" data-title=""><img class="example-image" src="images/'+id+'.jpg" alt=""/></a>' +
                            '<div class="content-item">' +
                                '<h3 class="title-item"><a href="#">'+result[0].title+'</a></h3>' +
                                '<div class="time"> '+result[0].date+'</div>' +
                                '<p class="info">'+result[0].content+'</p>' +
                            '</div>' +
                            '<div class="bottom-item">' +
                                '<a class="btn btn-share share" id="join">我要参加</a>' +
                                '<span class="user f-right">发起者： <a href="#">'+result[0].author+'</a><img src="images/ava-1.jpg"></span>' +
                            '</div>' +
                            otherListHtml +
                        '</article></center>' +
                    '</div>';
            console.log(html);
            $("#page-content").append(html);
            $(".bottom-item #join").on("click", function(event) {
                addOther(pageId);
            });
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
    } 
    getById(pageId);

    // $(".bottom-item #join").on("click", function(event) {
    //     console.log(111111111);
    //     addOther(pageId);
    // });


    function addOther(pageId){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "addOther";
        var callArgs = "[\"" + pageId + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                        console.log("addOther is " + resp)
                        //upadte card status into in progress...
                }
        }); 
    }

});