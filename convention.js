'use strict';
var ContractItem = function(text){
    if(text){
       var obj = JSON.parse(text);
       this.id = obj.id;
       this.title = obj.title;
       this.date = obj.date;
       this.author = obj.author;
       this.content = obj.content;
       this.otherManList = obj.otherManList;
    }
};


ContractItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

var ContractItems = function () {   
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new ContractItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

ContractItems.prototype ={
    init:function(){
        this.size = 0
    },

    //新增一个活动邀约
    addANew:function(date,title,content){
        if(!content){
            throw new Error("内容不能为空")
        }

        var from = Blockchain.transaction.from;
        
        // var contractItem = this.data.get(date);
    
        var newContractItem = {};
        newContractItem.otherManList = [];

        var id = 0;
        if(LocalContractStorage.get("id")){
           id = LocalContractStorage.get("id");
        }
        newContractItem.id = id;
        newContractItem.title = title;
        newContractItem.date = date;
        newContractItem.author = from;
        newContractItem.content = content;

        newContractItem.otherManList.push(from);

        this.data.put(id,newContractItem);

        this.size = this.size + 1
        LocalContractStorage.set("id", this.size);

        return this.size;
    },

    getById:function(id){
        if(!id){
            throw new Error("empty id")
        }
        return this.data.get(id);
    },

    addTwo:function(){
        this.size += 2
        LocalContractStorage.set("id", this.size);
    },

    getSize:function(){
        return LocalContractStorage.get("id");
    },

    //其他人参与这个活动，加入活动名单
    addOther:function(id){
        var from = Blockchain.transaction.from;
        var contractItem = this.data.get(id);
        if(contractItem){
            for(var i = 0; i < contractItem.length; i++){
                if(contractItem.otherManList[i] === from){
                    return;
                }
            }

            contractItem.otherManList.push(from);
            this.data.put(id,contractItem);
        }
    },

    //所有活动邀约的内容
    getInfo:function(){
        this.size = LocalContractStorage.get("id", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            info.push(this.data.get(i))
        }
        return info;
    }

}

module.exports = ContractItems;