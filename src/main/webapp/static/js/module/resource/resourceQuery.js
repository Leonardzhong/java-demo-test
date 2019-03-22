/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2015/8/18
 * Time: 11:18
 */

var tmpInitFlag = 0;

//初始化方法
$(document).ready(function() {

  //选择区域获取运营中心联动
    $('#area').combobox({
        onChange:function(newValue,oldValue){
        	changeAera('#area','#operateCenter',1);
        }
    });
    
    $('#creatorArea').combobox({
        onChange:function(newValue,oldValue){
        	changeAera('#creatorArea','#creatorOperateCenter',0);
        }
    });
    
  //初始化wind
	$('#resourceDetailsWind').window({
						title:'资源详情',
						width:600,
						height:500,
						modal:true,
						closed:true
					});
    
    initArea();
    
    initRoleLsit();
    
    initRange();
    
    //createTable();
    
});

/**
 * 初始化区域
 */
function initArea(){
    $.ajax({
        url : '/erp/common/areaCascadeController/getUserArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
				}
                data = getUniqueAreas(data);
				$('#area').combobox('loadData', data);
				$('#area').combobox('select', data[0].org_no); //默认选中全部
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
    /*ParamUtil.crateParams();
	ParamUtil.addParam('String',"");
	//获取全部的运营中心，和erp无关
	josnRequest('/execute/areaCascadeDao/getArea',ParamUtil.getParams(),function(data){
		if(data.length>0){
			if(data.length>1){
				data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
			}
			$('#creatorArea').combobox('loadData', data);
			$('#creatorArea').combobox('select', data[0].org_no); //默认选中全部
        }
	} );*/

	$.ajax({
		url : '/erp/common/areaCascadeController/getAllArea',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if(data.length>0){
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
				}
				$('#creatorArea').combobox('loadData',  data);
				$('#creatorArea').combobox('select', data[0].org_no); //默认选中全部
			}
		},
		error:function(data){
			alert("获取区域信息失败!");
		}
	});
}

/**
 * 初始化角色列表
 */
function initRoleLsit(){
	$.ajax({
		url : '/erp/common/roleController/getRoleList',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if(data.length>0){
                $('#roleList').combobox('loadData', data);
			}
		},
		error:function(data){
	       alert("获取角色信息失败!");
		}
	});
}

/**
 * 菜单联动，区域变化，运营中心联动
 */
function changeAera(areName,distributeName,tmp){
	areaNo =  $(areName).combobox('getValue');
	if(areaNo=='-1'){
		//区域选择的是全部
		var data = [{"distribute_name":"全部","distribute_no":"-1"}];
		$(distributeName).combobox('loadData', data);
		$(distributeName).combobox('select', "-1"); //默认选中全部
		if(tmp==1&&tmpInitFlag==0){
			createTable();
			tmpInitFlag++;
		}
	}else{
		$.ajax({
			url : '/erp/common/areaCascadeController/getOperateCenter',
			data:'areaNo='+areaNo, 
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				operateCenterNo='';
				if(data.length>0){
					if($(distributeName).length>0){//控件是否存在
						if(data.length>0){
							if(data.length>1){
								data.splice(0,0,{"distribute_name":"全部","distribute_no":"-1"});//增加全部选项 -1
							}
							$(distributeName).combobox('loadData', data);
							$(distributeName).combobox('select', data[0].distribute_no); //默认选中全部
							if(tmp==1&&tmpInitFlag==0){
								createTable();
								tmpInitFlag++;
							}
						}
						
					}
				}
			},
			error:function(data){
	           alert("获取运营中心信息失败!");
			}
		});
	}
	
}

function myformatter(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}

function myparser(s){
	if (!s) return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0],10);
	var m = parseInt(ss[1],10);
	var d = parseInt(ss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
		return new Date(y,m-1,d);
	} else {
		return new Date();
	}
}

/**
 * 初始化范围
 */
function initRange(){
	
	var data = [{"id":"-1","text":"全部"},{"id":"0","text":"全国"},{"id":"1","text":"部分"}];
	$('#range').combobox('loadData', data);
	$('#range').combobox('select', "-1");
}

/**
 * 创建列表
 */
function createTable(){
	
	ParamUtil.crateParams();
	
	//创建查询条件page对象
	var page = {
				param:{
					createTime:$('#createTime').datebox('getValue')!=''?$('#createTime').datebox('getValue')+' 00:00:00':'',//创建时间开始
					createTimeEnd:$('#createTimeEnd').datebox('getValue')!=''?$('#createTimeEnd').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
					ERP:$('#erp').val(),
					resource:{
						name:$('#fileName').textbox('getValue'),//文件名
						org:{org_no:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue')},//区域no
						distribute:{distribute_no:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue')},//运营中心no
						range:$('#range').combobox('getValue')=='-1'?null:$('#range').combobox('getValue'),//发送范围 0：全国 ，1：部分
						author:{boundErp:$('#fileCreator').textbox('getValue'),
								orgNo:$('#creatorArea').combobox('getValue')=='-1'?"":$('#creatorArea').combobox('getValue'),
								distributeNo:$('#creatorOperateCenter').combobox('getValue')=='-1'?"":$('#creatorOperateCenter').combobox('getValue')
						}
					}
	}};
	console.log(page);
	ParamUtil.addParam('Page',page);
	
	$('#resourceGrid').datagrid({
		url : '/execute/resourceService/queryForPageResource.json',
		queryParams: {'params':ParamUtil.getParams()},
		rownumbers:false,
		striped:true,
		columns : [ [
				{
					field : 'ck',
					checkbox: true
				},
				{
					field : 'createTime',
					title : '建立时间',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						var date = new Date();
						date.setTime(value);
						return date.format('yyyy-MM-dd');
					}
				},
				{
					field : 'size',
					title : '文件大小',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						var size = value/1024/1024;
						if(size==null||size<0.01){
							size = 0.01;
						}else{
							size=Math.round(size*100)/100;
						}
						return size+'M';
					}
				},
				{
					field : 'name',
					title : '文件名',
					width : '150',
					align:'center'
				},
				{
					field : 'range',
					title : '文件发送范围',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return value==0?'全国':'部分';
					}
				},
				{
					field : 'author.userName',
					title : '创建人',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return row.author.userName;
					}
				},
				{
					field : 'createDept',
					title : '创建人部门',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						var tmp = "";
						if(row.author.distributeName!=null&&row.author.distributeName!=''){
							return row.author.orgName+'-'+row.author.distributeName;
						}else{
							return row.author.orgName;
						}
					}
				},
				{
					field : '操作',
					title : '操作',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return '<a href="javascript:queryResourceDetail('+index+');">详情</a>';
					}
				}
				] ],
		pagination:true,
		loader: gridPageLoader,
		onDblClickRow: function (rowIndex, rowData) {
//			console.log('123'+rowData);
			queryResourceDetail(rowIndex);
		}
	});
}

/**
 * 点击删除按钮， 获取选中的资源进行删除 批量
 */
function deleteResources(){
	$.messager.confirm('确认','确认删除所选资源？',function(r) {
		if(r){
			var checkedItems = $('#resourceGrid').datagrid('getChecked');
			if (checkedItems.length > 0) {
				var ids = [];
				$.each(checkedItems, function (index, item) {
					ids.push(item.id);
				});
				console.log(ids.join(","));
				ParamUtil.crateParams();
				ParamUtil.addParam('List<Long>', ids);
				josnRequest('/execute/resourceService/deleteResource.json', ParamUtil.getParams(), function (data) {
					createTable();
				});
			} else {
				jQuery.messager.alert('提示', '选中后才可删除!', 'warning');
			}
		}
	});
}

/**
 * 查询信息详细
 */
function queryResourceDetail(index){
	
	var resource = $('#resourceGrid').datagrid("getRows")[index];
	console.log(resource)
	var urlStr = resource.url;
	if(urlStr.indexOf('http')<0){
		urlStr = 'http://'+ resource.url;
	}
	$('#fileURL').attr('href',urlStr);
//	$('#fileURL').attr('target',resource.url);
	$("#fileURL").text(resource.name);
	var size = resource.size/1024/1024;
	if(size==null||size<0.01){
		size = 0.01;
	}else{
		size=Math.round(size*100)/100;
	}
	$('#fileSizeW').text(size+'M');
	$('#createUserW').text(resource.author.userName);
	var date = new Date();
	date.setTime(resource.createTime);
	var createTime =  date.format('yyyy-MM-dd hh:mm:ss');
	$('#createTimeW').text(createTime);
	$('#rangeW').text(resource.range==0?'全国':'部分');
	
	$('#resourceDetailsWind').window('open');
	
	ParamUtil.crateParams();
	ParamUtil.addParam('Map',{
								areaNo:resource.org!=null?resource.org.org_no:null,
								distributeNo:resource.distribute!=null?resource.distribute.distribute_no:null
	});
	console.log(ParamUtil.getParams());
	josnRequest('/execute/areaCascadeDao/getOperateCenter',ParamUtil.getParams(),function(data){
		console.log(data);
		if(data.length>0){
			var tmp = ''; 
           for(var i=0;i<data.length;i++){
        	   tmp+=data[i].org_name+'-'+data[i].distribute_name+'\n';
           }
           $('#rangeDetailW').text(tmp);
        }
	} );
}

/**
 * 点击查询按钮，重新构建列表
 */
function resourceQuery(){
	//判断时间参数是否开始时间小于介素时间
	if(!compare('createTime','createTimeEnd')){
		$.messager.alert('提示','创建时间前大于后，请修改！','warning');
		return;
	}
	createTable();
}

/**
 * 多区域数组去除重复数据
 */
function getUniqueAreas(arr){
    var result = [];    // 返回结果
    var temp = [];      // 临时存放多区域编号
    for (var i = 0, len = arr.length; i < len; i++) {
        if (temp.indexOf(arr[i].org_no) == -1) {
            temp.push(arr[i].org_no);
            result.push(arr[i]);
        }
    }
    return result;
}

