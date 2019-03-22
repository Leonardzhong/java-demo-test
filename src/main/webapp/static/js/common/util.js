/**
 * 获取请求参数
 * @param name
 * @returns
 */
function getUrlParam(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null){
		return unescape(r[2]); 
	}
	return null; 
}

/**
 * grid加载器
 */
function gridLoader(param,success,error){
	var gridOptions = $(this).datagrid("options");
	ParamUtil.crateParams();
	for(var name in param){
		if(name == 'page'){
			ParamUtil.addParam('Integer',(param['page']-1)*param['rows']);
		}else if(name == 'rows'){
			ParamUtil.addParam('Integer',param[name]);
		}else if(name == 'params'){
			for(var i=0;i<param['params'].length;i++){
				ParamUtil.addParam(param['params'][i].typeAliase,param['params'][i].value);
			}
		}
	}
	var params = ParamUtil.getParams();
	$.ajax({
		url : gridOptions.url,
		contentType : "application/json",
		type : "post",
		data : JSON.stringify(params),
		async : false,
		success : function(result) {
			if(result.success){
				var dara=result.data;
				var pageData={};
				pageData['total']=page.total;
				pageData['rows']=data;
				
				success(pageData);
			}else{
				var errorWind=window.open(); 
				errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
				errorWind.document.write('<div style="font-size: 14;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
			}
		}
	});
}

function treegridLoader(param,success,error){
    var gridOptions = $(this).treegrid("options");
    ParamUtil.crateParams();
    for(var name in param){
        if(name == 'page'){
            ParamUtil.addParam('Integer',(param['page']-1)*param['rows']);
        }else if(name == 'rows'){
            ParamUtil.addParam('Integer',param[name]);
        }else if(name == 'params'){
            for(var i=0;i<param['params'].length;i++){
                ParamUtil.addParam(param['params'][i].typeAliase,param['params'][i].value);
            }
        }
    }
    var params = ParamUtil.getParams();
    $.ajax({
        url : gridOptions.url,
        contentType : "application/json",
        type : "post",
        data : JSON.stringify(params),
        async : true,
        success : function(result) {
            if(result.success){
                $(".loading-indicator-overlay").hide();
                $(".loading-indicator").hide();
                success(JSON.parse(result.data));
            }else{
                var errorWind=window.open();
                errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
                errorWind.document.write('<div style="font-size: 14;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
            }
        }
    });
}


function gridPageLoader(param,success,error){
	var gridOptions = $(this).datagrid("options");
	var size;
	var skip;
	ParamUtil.crateParams();
	if(param['params'].length==1 && param['params'][0].typeAliase=='Page'){
		param['params'][0].value['skip']=(param['page']-1)*param['rows'];
		param['params'][0].value['size']=param['rows'];
	}
	var params = param['params'];
	$.ajax({
		url : gridOptions.url,
		contentType : "application/json",
		type : "post",
		data : JSON.stringify(params),
		async : false,
		success : function(result) {
			if(result.success){
				var page=result.data;
				if(page){
					var data=page.data;
					var pageData={};
					pageData['total']=page.total;
					pageData['rows']=data;
				}
				success(pageData);
			}else{
				var errorWind=window.open(); 
				errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
				errorWind.document.write('<div style="font-size: 14;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
			}
		}
	});
}

/**
 * 参数工具
 */
var ParamUtil={
		
	params:null,
	
	crateParams : function(){
		this.params = new Array();
	},
	
	addParam : function(typeAliase,value){
		var o = {};
		o['typeAliase'] = typeAliase;
		o['value'] = value;
		this.params.push(o);
	},
	
	getParams : function(){
		return this.params;
	}
};

/**
 * 请求方法
 * @param url
 * @param param
 * @param callback
 */
function josnRequest(url,params,callback){
	$.ajax({
		url : url,
		contentType : "application/json",
		type : "post",
		data : JSON.stringify(params),
		async : false,
		success : function(result) {
			if(result.success){
                callback(result.data);

			}else{
				var errorWind=window.open(); 
				errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
				errorWind.document.write('<div style="font-size: 14;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
			}
			
		},error:function(data){
            alert("服务器访问出错")
        }
	});


}
function josnRequestResult(url,params,callback){

    $.ajax({
        url : url,
        contentType : "application/json",
        type : "post",
        data : JSON.stringify(params),
        async : false,
        success : function(result) {
            if(result.success){
                if(result.data!=null){
                    callback(result.data);
                }else{
                    alert("服务器访问出错");
                }

            }else{
                var errorWind=window.open();
                errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
                errorWind.document.write('<div style="font-size: 14px;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
            }

        },error:function(data){
            alert("服务器访问出错")
        }
    });


}

/**
 * 时间格式化
 * @param format
 * @returns
 */
Date.prototype.format =function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	
	if(/(y+)/.test(format)) 
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
	
	return format;
}

function compare(start_id,end_id){
	if($('#'+start_id).datebox('getValue')=="" || $('#'+end_id).datebox('getValue')==""){
		return true;
	}
	if($('#'+start_id).datebox('getValue')<=$('#'+end_id).datebox('getValue')){
		return true;
	}else{
		return false;
	}
}
/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getNextMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}
////获取当前时间
function getdate()
{
    var now=new Date()
    y=now.getFullYear()
    m=now.getMonth()+1
    d=now.getDate()
    m=m<10?"0"+m:m
    d=d<10?"0"+d:d
    return y+"-"+m+"-"+d
}
