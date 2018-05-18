"use strict";
$(function () {  
    /******************* config environment *******************/

    //test net for develop, remove the comment to use test net
    var dappContactAddress = "n1rYbwxEFn78nFWHnSgjybxK1Kc1iem2GaZ";
    var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

    //main net for deploy, comment out this when develop
    // var dappContactAddress = "n1rMRGPsJdoS7jXcfwCCjEMKnm56jtMoQeL";
    // var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    // neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

    /******************* config environment end *******************/


    // set newest 3 bets in left part
    var html = '';
    var topList = result.itemList;
    for(var i = 0, iLen = itemList.length; i < iLen; i++) {
        html += '<li>' +
                '<p class="item-content">'+ itemList[i].content +'</p>' +
                '<p class="item-author">作者：'+ itemList[i].author +'</p>' +
                '</li>';
    }
    $('#itemList').append(html);

    var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    var nebPay = new NebPay();
    var serialNumber;
    $("#search").click(function () {
        if (!$("#datetime").val()) {
            alert('搜索日期不能为空');
            return;
        }
        // $('#content').text("");
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "get";
        var callArgs = "[\"" + $("#datetime").val() + "\"]";
        //console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
            "function": callFunction,
            "args": callArgs
        };
        neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            var result = resp.result;   
            if (result === 'null') {
                $('.search-results').text("今天还没有人记录，来当第一名吧");
                return;
            }
            result = JSON.parse(result);
            console.log(result);
            $(".search-results").css("display", "initial");
            $(".new-memory").css("display", "none");
            $("#itemList").empty();
            var html = '';
            var itemList = result.itemList;
            for(var i = 0, iLen = itemList.length; i < iLen; i++) {
                html += '<li>' +
                        '<p class="item-content">'+ itemList[i].content +'</p>' +
                        '<p class="item-author">作者：'+ itemList[i].author +'</p>' +
                        '</li>';
            }
            $('#itemList').append(html);
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
    });
    $('#post').click(function () {
        if (!$("#input_title").val() || !$("#input_content").val()) {
            alert('时间或者内容不能为空');
            return;
        }
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = "[\"" + $("#input_title").val() + "\",\"" + $("#input_content").val() + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: function (resp) {
                console.log("thecallback is " + resp)
            }
        });
    });
    $("#add").click(function () {
        $(".search-results").css("display", "none");
        $(".new-memory").css("display", "initial");
    });
});