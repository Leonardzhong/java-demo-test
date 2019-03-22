$(function() {

	$('#queryPanel').panel({
		width : '100%',
		height : '100%',
		title : '物料追踪查询'
	});

	$('#area').combobox({
		valueField : 'org_no',
		textField : 'org_name',
		editable:false,
		onSelect : function(record) {
			changeAera();
		}
	});

	$('#operateCenter').combobox({
		valueField : 'distribute_no',
		textField : 'distribute_name',
		editable:false
	});

	$('#grantArea').combobox({
		valueField : 'org_no',
		textField : 'org_name',
		editable:false,
		onSelect : function(record) {
			changeGrantAera();
		}
	});

	$('#grantOperateCenter').combobox({
		valueField : 'distribute_no',
		textField : 'distribute_name',
		editable:false
	});

	$('#signStatus').combobox({
		valueField : 'value',
		textField : 'text',
		editable:false,
		data : [ {
			value : '',
			text : '全部'
		}, {
			value : 0,
			text : '未签收'
		}, {
			value : 1,
			text : '签收异常'
		}, {
			value : 2,
			text : '签收完成'
		}, {
			value : 3,
			text : '正常'
		} ]
	});

	initArea();
	initGrantArea();
	initDatagrid();
	
	$('#wind').window({
		title:"物料详情",
	    width:'900',
	    height:400,
	    modal:true,
	    closed:true
	});

});

// 初始化区域
function initArea() {
	$.ajax({
		url : '/erp/common/areaCascadeController/getUserArea',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if (data.length > 0) {
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":""});//增加全部选项 #
				}
				$('#area').combobox('loadData', getUniqueAreas(data));
				$('#area').combobox('select', data[0].org_no); //默认选中全部
				
			}
		},
		error : function(data) {
			alert("获取区域信息失败!");
		}
	});
	
	var data = [ {
		"distribute_name" : "全部",
		"distribute_no" : ""
	} ];
	$('#operateCenter').combobox('loadData', data);
	$('#operateCenter').combobox('select', ""); // 默认选中全部
}
// 改变区域联动运营中心
function changeAera() {
	areaNo = $('#area').combobox('getValue');
	if (areaNo == '') {
		// 区域选择的是全部
		var data = [{"distribute_name" : "全部", "distribute_no" : ""}];
		$('#operateCenter').combobox('loadData', data);
		$('#operateCenter').combobox('select', ""); // 默认选中全部
	} else {
		$.ajax({
			url : '/erp/common/areaCascadeController/getOperateCenter',
			data : 'areaNo=' + areaNo,
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				operateCenterNo = '';
				if (data.length > 0) {
					if ($("#operateCenter").length > 0) {// 控件是否存在
						if (data.length > 0) {
							if(data.length>1){
								data.splice(0,0,{"distribute_name":"全部","distribute_no":""});//增加全部选项 -1
							}
							$('#operateCenter').combobox('loadData', data);
							$('#operateCenter').combobox('select', data[0].distribute_no); //默认选中全部
						}

					}
				}
			},
			error : function(data) {
				alert("获取运营中心信息失败!");
			}
		});
	}
}

// 初始化区域 (需要显示所有的区域)
function initGrantArea() {
	$.ajax({
		url : '/erp/common/areaCascadeController/getAllArea',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if (data.length > 0) {
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":""});//增加全部选项 #
				}
				$('#grantArea').combobox('loadData', data);
				$('#grantArea').combobox('select', data[0].org_no); //默认选中全部
			}
		},
		error : function(data) {
			alert("获取区域信息失败!");
		}
	});
	var data = [ {
		"distribute_name" : "全部",
		"distribute_no" : ""
	} ];
	$('#grantOperateCenter').combobox('loadData', data);
	$('#grantOperateCenter').combobox('select', ""); // 默认选中全部
}
// 改变区域联动运营中心
function changeGrantAera() {
	areaNo = $('#grantArea').combobox('getValue');
	console.log(areaNo);
	if (areaNo == '') {
		// 区域选择的是全部
		var data = [ {
			"distribute_name" : "全部",
			"distribute_no" : ""
		} ];
		$('#grantOperateCenter').combobox('loadData', data);
		$('#grantOperateCenter').combobox('select', ""); // 默认选中全部
	} else {
		$.ajax({
            url : '/erp/common/areaCascadeController/getAllOperateCenter',
            data : 'areaNo=' + areaNo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                operateCenterNo = '';
                if (data.length > 0) {
                    if ($("#grantOperateCenter").length > 0) {// 控件是否存在
                        if (data.length > 0) {
                            if(data.length>1){
                                data.splice(0,0,{"distribute_name":"全部","distribute_no":""});//增加全部选项 -1
                            }
                            $('#grantOperateCenter').combobox('loadData', data);
                            $('#grantOperateCenter').combobox('select', data[0].distribute_no); //默认选中全部
                        }

                    }
                }
            },
            error : function(data) {
                alert("获取运营中心信息失败!");
            }
		});
	}
}

/**
 * 
 */
function initDatagrid(){
	
	ParamUtil.crateParams();
		
		//创建查询条件page对象
		var page = {
					param:{
						signTimeStart:$('#signTimeStart').datebox('getValue')!=''?$('#signTimeStart').datebox('getValue')+' 00:00:00':'',//创建时间开始
						signTimeEnd:$('#signTimeEnd').datebox('getValue')!=''?$('#signTimeEnd').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
						grantDateStart:$('#grantDateStart').datebox('getValue')!=''?$('#grantDateStart').datebox('getValue')+' 00:00:00':'',//创建时间开始
						grantDateEnd:$('#grantDateEnd').datebox('getValue')!=''?$('#grantDateEnd').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
						ERP:$('#erp').val(),
						material:{
							org:{org_no:$('#area').combobox('getValue')},//区域no
							distribute:{distribute_no:$('#operateCenter').combobox('getValue')},//运营中心no
							signStatus:$('#signStatus').combobox('getValue'),//状态
							grantUser:{boundErp:$('#grantUser').textbox('getValue'),
									orgNo:$('#grantArea').combobox('getValue')=='-1'?"":$('#grantArea').combobox('getValue'),
									distributeNo:$('#grantOperateCenter').combobox('getValue')=='-1'?"":$('#grantOperateCenter').combobox('getValue')}
						}
		}};
	ParamUtil.addParam('Page',page);
	
	$('#queryGrid').datagrid({
		url : '/execute/materialService/queryForPageMaterial.json',
		queryParams: {'params':ParamUtil.getParams()},
		rownumbers:true,
		width : '100%',
		columns : [ [
				{
					field : 'ck',
					checkbox: true
				},
				{
					field : 'org',
					title : '区域',
					width : '100',
					align:'center',
					formatter: function(value,row,index){
						if(value==null){
							return "";
						}
						if(value['org_name']=="#"){
							return "全国";
						}
						return value['org_name'];
					}
				},
				{
					field : 'distribute',
					title : '运营中心',
					width : '135',
					align:'center',
					formatter: function(value,row,index){
						if(value==null){
							return "";
						}
						if(value['distribute_name']=="#"){
							return "全国";
						}
						return value['distribute_name'];
					}
				},
				{
					field : 'grantSkuNum',
					title : '品类数量',
					width : '100',
					align:'center'
				},
				{
					field : 'signedNum',
					title : '签收情况',
					width : '220',
					align:'center',
					formatter: function(value,row,index){
						return '已签收'+value+'种品类';
					}
				},
				{
					field : 'signStatus',
					title : '签收状态',
					width : '120',
					align:'center',
					formatter: function(value,row,index){
						if(value==0){
							return '未签收';
						}else if(value==1){
							return '签收异常';
						}else if(value==2){
							return '签收完成';
						}else if(value==3){
							return '正常';
						}
						
					}
				},
				{
					field : 'grantTime',
					title : '发放时间',
					width : '220',
					align:'center'
				},
				{
					field : 'orgName',
					title : '发放部门',
					width : '120',
					align:'center',
					formatter: function(value,row,index){
						return row.grantUser.orgName+row.grantUser.distributeName;
					}
				},
				{
					field : 'userName',
					title : '发放人姓名',
					width : '120',
					align:'center',
					formatter: function(value,row,index){
						return row.grantUser.userName;
					}
				},
				{
					field : '操作',
					title : '操作',
					width : '120',
					align:'center',
					formatter: function(value,row,index){
						return '<a href="javascript:loadMaterialRecord('+index+');">详情</a>';
					}
				}
				] ],
		pagination:true,
		loader: gridPageLoader,
		onDblClickRow: function (rowIndex, rowData) {
			loadMaterialRecord(rowIndex);
		}
	});
}


function loadMaterialRecord(index){
	
	var rd = $('#queryGrid').datagrid('getRows')[index];
	$('#wind').window('open');
	
	var orgName = rd.org['org_name'];
	var distributeName=rd.distribute['distribute_name'];
	var grantUserNameDept=rd.grantUser.orgName+rd.grantUser.distributeName;
	var grantUserName=rd.grantUser.userName;
	$('#materialRecordGrid').datagrid({
		rownumbers:true,
		width : '100%',
		columns : [ [
				{
					field : 'org',
					title : '区域',
					width : '70',
					align:'center',
					formatter: function(value,row,index){
						if(orgName=="#"){
							return "全国";
						}
						return orgName;
					}
				},
				{
					field : 'distribute',
					title : '运营中心',
					width : '90',
					align:'center',
					formatter: function(value,row,index){
						if(distributeName=="#"){
							return "全国";
						}
						return distributeName;
					}
				},
				{
					field : 'name',
					title : '物料',
					width : '80',
					align:'center'
				},
				{
					field : 'num',
					title : '发放数量',
					width : '60',
					align:'center'
				},
				{
					field : 'signNum',
					title : '签收数量',
					width : '60',
					align:'center'
				},
				{
					field : 'signStatus',
					title : '签收状态',
					width : '60',
					align:'center',
					formatter:function(value,row,index){
						if(value==0){
							return '未签收';
						}else if(value==1){
							return '签收正常';
						}else if(value==2){
							return '签收异常';
						}
					}
				},
				{
					field : 'signUser',
					title : '签收人',
					width : '80',
					align:'center',
					formatter: function(value,row,index){
						if(value){
							return value.userName;
						}else{
							return "";
						}
						
					}
				},
				{
					field : 'receiveTime',
					title : '签收时间',
					width : '80',
					align:'center'
				},
				{
					field : 'grantUserNameDept',
					title : '发放部门',
					width : '120',
					align:'center',
					formatter: function(value,row,index){
						return grantUserNameDept;
					}
				},
				{
					field : 'grantUserName',
					title : '发放人姓名',
					width : '80',
					align:'center',
					formatter: function(value,row,index){
						return grantUserName;
					}
				}
				] ]
	});
	
	$('#materialRecordGrid').datagrid('loadData',rd.materialRecords);
}

function query(){
	if(!compare('signTimeStart','signTimeEnd')){
		$.messager.alert('提示','签收时间前大于后，请修改！');
		return;
	}
	if(!compare('grantDateStart','grantDateEnd')){
		$.messager.alert('提示','发放时间前大于后，请修改！');
		return;
	}
	initDatagrid();
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