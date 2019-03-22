/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2015/8/18
 * Time: 11:39
 */


//初始化方法
$(document).ready(function() {


    //选择区域获取运营中心联动
    $('#area').combobox({
        onChange:function(newValue,oldValue){
            areaNo =  $('#area').combobox('getValue');

            $.ajax({
                url : '/erp/common/areaCascadeController/hasAllOperateCenterPrivilege',
                data:'areaNo='+areaNo,
                type : 'POST',
                dataType : 'json',
                success : function(data) {
                    var operateAllflag = $.parseJSON(data);
                    changeAera(operateAllflag);
                },
                error:function(data){
                    alert("获取是否含有全部的运营中心失败!");
                }
            });
        },
		editable:false
    });

	$('#Lists').panel({
		width:'100%',
		title:'资源上传'
	});


    hasAllArea();

	//initArea();
    
    initRoleLsit();
    
});


/**
 *  判断当前用户的区域权限是否是全国（#），然后再进行初始化区域
 */
function hasAllArea() {

    var areaAllflag = false;

    $.ajax({
        url : '/erp/common/areaCascadeController/hasAllAreaPrivilege',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            areaAllflag = $.parseJSON(data);
            initArea(areaAllflag);
        },
        error:function(data){
            alert("获取是否含有全国区域失败!");
        }
    });
}

//初始化区域
function initArea(areaAllflag){
    $.ajax({
        url : '/erp/common/areaCascadeController/getUserArea',
        type : 'POST',
        dataType : 'json',
        async:false,
        success : function(data) {
            if(data.length>0){
				if(data.length > 1 && areaAllflag){
					data.splice(0,0,{"org_name":"全部","org_no":"-1"});   //增加全部选项 #
				}
				data = getUniqueAreas(data);                            // 去除重复
				$('#area').combobox('loadData', data);
				$('#area').combobox('select', data[0].org_no);          // 默认选中全部
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
}

//初始化角色列表
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

function changeAera(operateAllflag){
	areaNo =  $('#area').combobox('getValue');
	if(areaNo=='-1'){
		//区域选择的是全部
		var data = [{"distribute_name":"全部","distribute_no":"-1"}];
		$('#operateCenter').combobox('loadData', data);
		$('#operateCenter').combobox('select', "-1"); //默认选中全部
	}else{
		$.ajax({
			url : '/erp/common/areaCascadeController/getOperateCenter',
			data:'areaNo='+areaNo, 
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				operateCenterNo='';
				if(data.length>0){
					if($("#operateCenter").length>0){//控件是否存在
						if(data.length>0){
							if(data.length>1 && operateAllflag){
								data.splice(0,0,{"distribute_name":"全部","distribute_no":"-1"});//增加全部选项 -1
							}
							$("#operateCenter").combobox('loadData', data);
							$('#operateCenter').combobox('select', data[0].distribute_no); //默认选中全部
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

function upload(){
	var areaValue = $('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue');
	var operateCenterValue = $('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue');
	var arr = $('#roleList').combobox('getValues');
	//判断role是否选择
	if(arr==null||arr.length==0){
		jQuery.messager.alert('提示:','请选择对应的角色','warning');
	}else {
		if(!valueDate()){
			return;
		}
		var roleListStr = "";
		for (var i = 0; i < arr.length; i++) {
			roleListStr += arr[i] + ";";
		}
		var roleListValue = roleListStr;
		//console.log($('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'));
		$($("#uploadVm").contents().find('form')).append($('<input type="hidden"  name="erp" value="' + $('#erp').val() + '">'));
		$($("#uploadVm").contents().find('form')).append($('<input type="hidden"  name="orgNo" value="' + areaValue + '">'));
		$($("#uploadVm").contents().find('form')).append($('<input type="hidden"  name="distributeNo" value="' + operateCenterValue + '">'));
		$($("#uploadVm").contents().find('form')).append($('<input type="hidden"  name="roleNoList" value="' + roleListValue + '">'));
		$("#uploadVm").contents().find('form').ajaxSubmit({
			type: 'post',
			url: '/fileUpload/bathAddFile',
			dataType: 'text',
			timeout: 120000,
			success: function (data) {
				var dataObj = eval('(' + data + ')');
				if(dataObj.error!='false'&&dataObj.message!='null'){
					$.messager.alert('错误', '失败原因'+dataObj.message,'error');
				}else{
					try {
						jQuery.messager.alert('提示','资源库上传成功','success');
						window.location.href='/getView/trainManage/resourceManage';
					} catch (e) {
						$.messager.alert('错误', '上传失败','error');
					}
				}
			},
			error: function (data) {
				if (data.statusText == "timeout") {
					jQuery.messager.alert('错误','请求超时','error');
				}
			}
		});
	}
}

var tmpInt = 1;
function addFile(){
	var table = $($("#uploadVm").contents().find('table'));
	var tr = $('<tr id="tr'+tmpInt+'"><td align="left"><input type="file" name="files'+tmpInt+'"><a href="javascript:deleteFile('+tmpInt+')">删除</a></td></tr>');
	table.append(tr);
	tmpInt++;
}
/**
 * 验证文件类型
 * @returns {boolean}
 */
function valueDate(){
	//console.log($("#uploadVm").contents().find(':file').length);
	for(var i=0;i<$("#uploadVm").contents().find(':file').length;i++){
		var file=$("#uploadVm").contents().find(':file')[i].value;
		if(file==''){
			$.messager.alert('提示','上传文件不能为空！','warning');
			return false;
		}
		var d=/\.[^\.]+$/.exec(file);
		//console.log(d+";"+(d!='.docx'));
		if(d!='.xls'&&d!='.xlsx'&&d!='.doc'&&d!='.docx'&&d!='.ppt'&&d!='.pptx'&&d!='.pdf'&&d!='null'){
			$.messager.alert('提示','上传文件类型只能是（word、excel、ppt、pdf）','warning');
			return false;
		}
	}
	return true;
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


