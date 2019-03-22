var timeId=null;
$(function() {

	initGrid();
	$("#queryBtn").bind("click", query);
	$("#clearBtn").bind("click", clearForm);
	$("#submitBtn").bind("click", submitAnswer);
	province_county();



});
var dlg = '<div id="dlg"  style="width:300px; height:200px;" title="提示" >'
	+ '京东帮开店申请提交成功！<br> 请关注回复，感谢您的支持' + '</div>'
function clearForm(applicationid, applicantid) {
	$("#qstatus").val("");
	$('#ff').form('clear');
	$("#answerStart").val('');
	$("#answerEnd").val('');
	$("#applyStart").val('');
	$("#applyEnd").val('');
	$("#applicantName").val('');
	$("#city").empty();
	$("#county").empty();
	$("#township").empty();
	$("#province").val('');
	$("#distribute").empty();
	$("#wareHouse").val('');

}
function showRow(applicationid, applicantid) {
	$.ajax({
		type : "POST",
		url : "/erp/application/showApplicationsById",
		data : "applicationid=" + applicationid,
		success : function(msg) {
			showRowDailog($.parseJSON(msg));

		}
	});

}
function showRowDailog(info) {
	$("#STATUS").html(info.STATUS);
	$("#applicantEmail").html(info.applicantEmail);
	$("#applicantPhone").html(info.applicantPhone);
	$("#applicantPhone").html(info.applicantPhone);
	$("#addressDetail").html(info.addressDetail);
	$("#showapplicantName").html(info.applicantName);
	$("#address").html(info.provinceName +"&nbsp;&nbsp;"+info.cityName  +"&nbsp;&nbsp;"+info.countyName +"&nbsp;&nbsp;"+info.townshipName);


	$("#com_createdate").html(info.com_createdate);
	$("#companyName").html(info.companyName);
	$("#registeredcode").html(info.registeredcode);
	$("#artificialperson").html(info.artificialperson);
	$("#cardId").html(info.cardId);
	$("#electronicCardId").html(info.electronicCardId);
	$("#licenseDetail").html(info.licenseDetail);
	$("#createDate").html(info.createDate);
	$("#timeLimitStart").html(info.timeLimitStart);
	$("#timeLimitEnd").html(info.timeLimitEnd);
	$("#registeredCapital").html(info.registeredCapital);
	$("#electroniclicense").html(info.electroniclicense);
	$("#businessScope").html(info.businessScope);
	$("#applicantId").html(info.applicantId);
	$("#businessScope").html(info.businessScope);
	$("#applicantId").html(info.applicantId);

	var html=info.license_provinceName  +"&nbsp;&nbsp;"+info.license_cityName  +"&nbsp;&nbsp;"+ info.license_countyName +"&nbsp;&nbsp;"+ info.license_townshipName ||'';

	$("#licenseaddress").html(html);


	$("#grantBrand").html(info.grantBrand);
	$("#grantType").html(info.grantType);
	$("#STATUS").html(info.STATUS);



	info.content =info.content ||'';
	info.answerDate =info.answerDate ||'';
	info.content =info.content ||'';

	$("#showwareHouse").html(info.wareHouseName);
	$("#showdistribute").html(info.distributeName);
	$("#showanswerDate").html(info.answerDate);
	$("#showcontent").html(info.content).attr("title",$("#showcontent").html());

	//处理非大陆证件  永久
	if(info.timelimitless == '1'){
		$("#showtimelimitless")[0].checked = true;
	}
	if(info.nochineseCardId == '1'){
		$("#shownochineseCardId")[0].checked = true;
	}
	//处理附件
	var electronicCardId=info.electronicCardId;
	var electroniclicense=info.electroniclicense;
	var grant=info.grant;
	$('#electronicCardId tbody').empty();
	$('#electroniclicense tbody').empty();
	$('#grant tbody').empty();
	inserRow($('#electronicCardId'),electronicCardId);
	inserRow($('#electroniclicense'),electroniclicense);
	inserRow($('#grant'),grant);


	$('#showApp').dialog('open');

}
function inserRow(table, array) {
	if (array == null || array.length == 0) {
		return;
	}
	var add = array.length % 2;
	var length = parseInt(array.length / 2);
	for (var int = 0; int < length; int++) {
		var first = 2 * int;
		var second = first + 1;
		var tr = $("<tr></tr>");
		tr.appendTo($(table));
		var td1 = $('<td ><a target="_blank"   tyle="width:100px;display:block;" href="' + array[first].affixPath
		+ '"><span style="width:140px;  overflow:hidden; display: block; " >' + array[first].affixName + '</span></a></td>');
		td1.appendTo(tr);
		var td2 = $('<td  > <a target="_blank"   tyle="width:100px;display:block" href="' + array[second].affixPath
		+ '"><span style="width:140px;  overflow:hidden;display: block;  " >' + array[second].affixName + '</span></a></td>');
		td2.appendTo(tr);

	}

	if (add == 1) {
		var tr = $("<tr></tr>");
		var td1 = $('<td colspan="2" tyle="width:100px; overflow:hidden;" ><a target="_blank"  style="width:100px;display:block" href="' 	+ array[array.length - 1].affixPath + '"><span style="width:140px;  overflow:hidden;display: block;  " >' 	+ array[array.length - 1].affixName + '</span></a></td>');
		td1.appendTo(tr);
		tr.appendTo($(table));
	}

}
function answerRow(applicationid, content,STATUS) {
	//状态  1 待回复、2 已回复、3 分配失败
	$("#content").val("");
	if(STATUS ==  2 || STATUS == '已回复'){
		$("#content").val(content ||'' );
	}
	$("#applicationid").val(applicationid);
	$("#applicantid").val(applicantid);
	$('#answerDiv').show().dialog('open');


}
function showMessage(msg){
	if ($("#dlg").length == 0) {
		$(dlg).appendTo(document.body);
	}
	$('#dlg').html(msg).dialog({
		title: '提示',
		width: 400,
		height: 200,
		closed: false,
		cache: false,
		modal: true
	});

}
function submitAnswer() {
	var data={};
	data["applicantid"]= $("#applicantid").val();
	data["applicationid"]= $("#applicationid").val();
	data["content"]= $("#content").val();
	data["answerName"]= $("#answerName").val();
	data["answerPhone"]= $("#answerPhone").val();
	if(data["answerPhone"] ==  null  || data["answerPhone"] == ''){
		$.messager.alert("提示","回复的电话不能为空","error");
		return;
	}
	if(data["content"] ==  null  || data["content"] == ''){
		$.messager.alert("提示","回复的内容不能为空","error");
		return;
	}
	if(  data["content"].length > 200){
		$.messager.alert("提示","回复的内容的长度不能超过200汉字","error");
		return;
	}
	$("#submitBtn").attr("disable","disabled");
	$.messager.progress({
		title: '请稍后',
		msg: '正在保存数据...',
		text: '保存数据中...'
	});

	$.ajax({
		type : "POST",
		url : "/erp/application/submitAnswer",
		data : data,
		success : function(msg) {
			$.messager.progress('close');
			$("#submitBtn").attr("disable","");
			msg = $.parseJSON(msg);
			$('#answerDiv').dialog('close');
			$.messager.alert("提示",msg.msg,"info");
			query() ;


		}
	});



}

function query() {
	$('#dataGrid').datagrid('load', getQueryData());
}
function getQueryData() {
	return {
		applicantName : $("#applicantName").val(),
		answerStart : $("#answerStart").val(),
		answerEnd : $("#answerEnd").val(),
		applyStart : $("#applyStart").val(),
		applyEnd : $("#applyEnd").val(),
		status : $("#qstatus").val(),
		province : $("#province").val(),
		city : $("#city").val(),
		county : $("#county").val(),
		wareHouseString : $("#wareHouseString").val(),
		distributeString : $("#distributeString").val(),
		township : $("#township").val(),
		township : $("#township").val(),
		userNo : $("#userNo").val(),
		distribute : $("#distribute").val(),
		wareHouse : $("#wareHouse").val()
	}
}

function initGrid() {
	var grid = $('#dataGrid')
		.datagrid(
		{
			url : "/erp/application/query",
			queryParams : getQueryData(),
			rownumbers:false,
			striped:true,
			pagination : true,
			columns : [ [

				{
					field : 'applicationDate',
					title : '申请时间',
					width : 75
				},
				{
					field : 'applicantName',
					title : '申请人姓名',
					width : 70
				},
				{
					field : 'addressName',
					title : '申请地址'  ,
					width : 220
				},
				{
					field : 'wareHouseName',
					title : '区域',
					width : 100
				},
				{
					field : 'distributeName',
					title : '中心',
					width : 100
				},
				{
					field : 'STATUS',
					title : '处理状态',
					width : 60
				},
				{
					field : 'applicantPhone',
					title : '电话',
					width : 100
				},
				{
					field : 'answerDate',
					title : '回复时间',
					width : 75
				},
				{
					field : 'mail',
					title : '申请人邮箱',
					width : 150
				},
				{
					field : 'opration',
					title : '操作',
					width : 70,
					formatter : function(value, rec) {

						var btn = "<a class='editcls' onclick='showRow(\""
							+ rec.applicationid
							+ "\",\""
							+ rec.applicantid
							+ "\")'   href='javascript:void(0)'>详情</a> <a class='editcls' onclick='answerRow(\""
							+ rec.applicationid
							+ "\",\""
							+ rec.content
							+ "\",\""
							+ rec.STATUS
							+ "\")'   href='javascript:void(0)'>回复</a>";

						return btn;
					}
				} ] ]
		});
	var getPager = $('#dataGrid').datagrid('getPager');
	$(getPager).pagination({
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 5, 10, 15 ],// 可以设置每页记录条数的列表
		beforePageText : '第',// 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录'
		/*
		 * onBeforeRefresh:function(){ $(this).pagination('loading'); alert('before
		 * refresh'); $(this).pagination('loaded'); }
		 */
	});
}

//三级联动
function province_county() {
	$("#province").on("change", function() {
		if("" == $(this).val()){
			$("#city").empty();
			$("#county").empty();
			$("#township").empty();
		}else{
			getCity($(this).val());
		}
	});
	$("#city").on("change", function() {
		if("" == $(this).val()){
			$("#county").empty();
			$("#township").empty();
		}else{
			getCounty($(this).val());
		}
	});

	$("#county").on("change", function() {
		if("" == $(this).val()){
			$("#township").empty();
		}else{
			getTownship($(this).val());
		}
	});
	$("#wareHouse").on("change", function() {
		if("" == $(this).val()){
			$("#distribute").empty();
		}else{
			getDistribute($(this).val());
		}
	})

}
function getCity(idProvince,fn){
	$.ajax({
		type : "POST",
		url : "/erp/application/getCity",
		data : "idProvince=" + idProvince,
		success : function(msg) {
			$("#city").empty();
			$("#county").empty();
			$("#township").empty();
			var data=$.parseJSON(msg);
			var html='<option value="">--请选择--</option>';
			for (var i = 0; i < data.length; i++) {
				html +="<option value='"+data[i].id+"'>"+data[i].name+"</option>";
			}
			$("#city").append(html);
			if($.type(fn) == 'function'){
				fn();
			}

		}
	});

}
function getCounty(idCity,fn){
	$.ajax({
		type : "POST",
		url : "/erp/application/getCounty",
		data : "idCity=" + idCity,
		success : function(msg) {
			$("#county").empty();
			$("#township").empty();
			var data=$.parseJSON(msg);
			var html='<option value="">--请选择--</option>';
			for (var i = 0; i < data.length; i++) {
				html +="<option value='"+data[i].id+"'>"+data[i].name+"</option>";
			}
			$("#county").append(html);
			if($.type(fn) == 'function'){
				fn();
			}

		}
	});
}
function getTownship(county,fn){
	$.ajax({
		type : "POST",
		url : "/erp/application/getTownship",
		data : "county=" + county,
		success : function(msg) {
			$("#township").empty();
			var data=$.parseJSON(msg);
			var html='<option value="">--请选择--</option>';
			for (var i = 0; i < data.length; i++) {
				html +="<option value='"+data[i].id+"'>"+data[i].name+"</option>";
			}
			$("#township").append(html);
			if($.type(fn) == 'function'){
				fn();
			}

		}
	});
}


function showArea(){
	if($("#info").val() != ''){
		var province=$("#province").val();
		if( province != null && province != '' ){
			getCity(province,function(){
				$("#city").val($("#city").attr("cvalue"));
				getCounty($("#city").attr("cvalue"), function(){
					$("#county").val($("#county").attr("cvalue"))
				})
			})
		}


	}
}
//地区也运营中心

function getDistribute(wareHouseNo,fn){
	$.ajax({
		type : "POST",
		url : "/erp/application/getDistributeByNo",
		data : "wareHouseNo=" + wareHouseNo+"&userNo="+$("#userNo").val(),
		success : function(msg) {
			$("#distribute").empty();
			var data=$.parseJSON(msg);
			var html='<option value="">--请选择--</option>';
			for (var i = 0; i < data.length; i++) {
				html +="<option value='"+data[i].deliverCenterCode+"'>"+data[i].deliverCenterName+"</option>";
			}
			$("#distribute").append(html);
			if($.type(fn) == 'function'){
				fn();
			}

		}
	});
}

