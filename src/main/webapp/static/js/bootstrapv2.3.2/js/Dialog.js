//author wangdongxing@jd.com
//date:2013-08-27
var Dialog={
		
	width:600,  //默认宽
	
	height:400, //默认高度
	
	backdrop:"static", //是否显示遮罩
	
	//标题，内容，按钮名称，按钮操作
	alert:function(title,message,btnLable,callback){
		if(btnLable==null||btnLable=="") btnLable="确定";
		bootbox.alert(message,title,btnLable,callback);
	},
	//标题，内容，“确认”按钮名称，“取消”按钮操作，回调函数 function(result),result为结果
	confirm:function(title,message,okLable,cancleLable,callback){
		if(okLable==null||okLable=="") okLable="确定";
		if(cancleLable==null||cancleLable=="") cancleLable="取消";
		bootbox.confirm(message,title,cancleLable,okLable,callback);
	},
	hideAll:function(){
		bootbox.hideAll();
	},
	hide:function(el){
		if(el==null){
			bootbox.hideAll();
		}else{
			while(el.hasClass("bootbox")==false){
				el=el.parent();
			}
			el.modal("hide");
		}
	},
	hideModal:function(modal){
		if(modal != null) modal.modal("hide");
	},
    openUrl:function(dialogId,title,url,width,height,btns){
        if(width==null||width=="")  width=Dialog.width;
        if(height==null||height=="")  height=Dialog.height;
        var html = '<iframe id="'+dialogId+'"  width="100%" height="100%" src="'+url+'" frameborder="no"></iframe>';
        bootbox.dialog(
            html,btns,
            {
                "header": title,
                "width":width,
                "height":height,
                "backdrop":Dialog.backdrop
            }
        );
    },
	//标题,内容，宽，高，按钮（数组）
	openSimple:function(dialogId,title,message,width,height,btns){
		/* btns 定义格式:
    	[	
 			{
 				"label": "Success",
 				"class": "btn-success",
 				"callback": function() {}
 			},
 			...
 		]*/
		if(width==null||width=="")  width=Dialog.width;
		if(height==null||height=="")  height=Dialog.height;
	    bootbox.dialog(
	        	message,btns,
	        	{
	               "header": title,
	        	   "width":width,
	        	   "height":height,
	        	   "backdrop":Dialog.backdrop
	            },dialogId
	     );
	},
	//标题,url，宽，高，按钮（数组）
	openRemote:function(dialogId,title,url,width,height,btns){
		if(width == null || width == "")  width = Dialog.width;
		if(height == null || height=="")  height = Dialog.height;
	    var bootboxDialog = bootbox.dialog(
	        	"",btns,
	        	{
	               "header": title,
	        	   "remote":url,
	        	   "width":width,
	        	   "height":height,
	        	   "backdrop":Dialog.backdrop
	            },dialogId
	    );
	},
	//删除地址,回调地址
	del:function(url,data,callback_fn){
		Dialog.confirm("删除警告","确定进行删除操作?","确定","取消",function(result){
			if(result){
				Dialog.post(url,data,callback_fn);
			}
		});
	},
	//地址，数据，回调函数，回调地址
	post:function(url,data,callback_fn){
		$.ajax({ 
			url:url,
			async:false,//同步提交
			type:"post",
			data:data,
			dataType : 'json',
			cache:false,
			complete:function(){},
			success: function(result){
				//具体操作
				callback_fn(result);
			},
			error : function(data) {
				Dialog.alert("请求异常",data.responseText);
		    } 
		});
	}
};
