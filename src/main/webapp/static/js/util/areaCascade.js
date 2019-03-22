var areaNo ='';
var operateCenterNo='';
$(document).ready(function(){
		
		var roleList='';
		//初始化获取区域
		$.ajax({
			url : '../common/areaCascadeController/getUserUniqueArea',
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				if(data.length>0){
					if(data.length>1){
						$("#area").html("<option value=''>请选择</option>");
					}
					for(var i=0;i<data.length;i++){
						$("<option value='"+data[i].org_no+"'>"+data[i].org_name+"</option>").appendTo($("#area"));
					}
					if(data.length==1){
						$("#area").change();
					}
					$("#area option:first").prop("selected", 'selected');    
				}
			},
			error:function(data){
	            alert("获取区域信息失败!");
			}
		});
		
		if($("#roleList").length>0){
			$.ajax({
				url : '../common/roleController/getRoleList',
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							$("<option value='"+data[i].roleNo+"'>"+data[i].roleName+"</option>").appendTo($("#roleList"));
						}
						$("#roleList").multiselect('rebuild');//刷新内容。
					}
				},
				error:function(data){
	               alert("获取角色信息失败!");
				}
			});
		}
		
		 //选择区域获取运营中心联动
		$("#area").on('change',function(){
			
			areaNo = $(this).val();
			
			$.ajax({
				url : '../common/areaCascadeController/getOperateCenter',
				data:'areaNo='+areaNo, 
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					operateCenterNo='';
					
					if(data.length>0){
						if($("#operateCenter").length>0){//控件是否存在
							if(data.length>1){
								$("#operateCenter").html("<option value=''>请选择</option>");
							} else if (data.length == 1){
                                $("#operateCenter").empty();     // 多区域修改：当切换到某个area只有1个对应的中心时，需要先清空
                            }
							
							if($("#operatorList").length>0){
								$("#operatorList").empty();//删除多选框的内容
								$("#operatorList").multiselect('rebuild');//刷新内容。
							}
							
							for(var i=0;i<data.length;i++){
								$("<option value='"+data[i].distribute_no+"'>"+data[i].distribute_name+"</option>").appendTo($("#operateCenter"));
							}
							if(data.length==1){
								if($("#operateCenter").length>0){
									$("#operateCenter").change();
								}
							}else{
								getOperatorList();
							}
							$("#operateCenter option:first").prop("selected", 'selected');
						}
					}else{
						if($("#operateCenter").length>0){
							$("#operateCenter").html("<option value=''>请选择</option>");
						}
					}
					reloadTable();
					clreaAllSelect();
				},
				error:function(data){
	               alert("获取运营中心信息失败!");
				}
			});
		});
		 //用户联动
		if($("#operatorList").length>0){
			$("#operateCenter").on('change',function(){
				
				
				operateCenterNo = $(this).val();
				reloadTable();
				clreaAllSelect();
				getOperatorList();
			});
		}
		
		//角色复选框
		if($("#roleList").length>0){
			$('#roleList').multiselect({
				nonSelectedText: '请选择',
				buttonWidth: '300px',
				buttonClass:'multiselect dropdown-toggle btn btn-default btn-sm',
	            enableFiltering: true,
	            includeSelectAllOption: true,
	            enableCaseInsensitiveFiltering: true,
	    		onChange: function(option, checked) {
		        	//alert('onChange!');         
		       	},       
		        onDropdownHide: function(event) { 
		          	
		        	roleList=$('#roleList').val();
		        	getOperatorList();
		        	//if(options==null){
		        	//		$('#operatorList').multiselect('enable');
		        	//}else{
		        	//		$('#operatorList').multiselect('deselectAll', false);
		        	//		$('#operatorList').multiselect('updateButtonText');
		        	//		$('#operatorList').multiselect('disable');
		        	//}
				}
	        });
		}
		
		//执行人复选框
		if($("#operatorList").length>0){
			$('#operatorList').multiselect({
				nonSelectedText: '请选择',
				buttonWidth: '300px',
				buttonClass:'multiselect dropdown-toggle btn btn-default btn-sm',
	            enableFiltering: true,
	            includeSelectAllOption: true,
	            enableCaseInsensitiveFiltering: true
	        });
		}
		//获取用户列表
		function getOperatorList(){
			if($("#operatorList").length>0){
				
					//$("#operateCenter").html("<option value=''>请选择</option>");
					//$("#operatorList").html("");
					//$("#operatorList").append("<option value='aa'>bb</option>"); 
					//$("#operatorList").multiselect('rebuild');//刷新内容。
					//$("#operatorList").multiselect('destroy');//销毁JS对象
					//$("#operatorList").next().remove();//删除JS对象生产的内容
					//$("#operatorList").empty();//删除多选框的内容
					//if(window.initoperatorList){
					//	initoperatorList();
					//}
					$("#operatorList").empty();//删除多选框的内容
					$("#operatorList").multiselect('rebuild');//刷新内容。
				
				
					var parm=[
					          {'name':'area','value':areaNo},
					          {'name':'operateCenter','value':operateCenterNo},
					          {'name':'roleIds','value':roleList}
					          ];
	        	
					$.ajax({
						url : '../common/areaCascadeController/getUser',
						data:parm,
						type : 'POST',
						dataType : 'json',
						success : function(data) {
							if(data.length>0){
								for(var i=0;i<data.length;i++){
									$("<option value='"+data[i].boundErp+"'>"+data[i].boundErp+"</option>").appendTo($("#operatorList"));
								}
							}
							$("#operatorList").multiselect('rebuild');
						},
						error:function(data){
							alert("获取用户信息失败!");
						}
					});
				}
		}
		function clreaAllSelect(){
			if($("#selectResult").length>0){
				$("#selectResult").smallWindow('closeAll');
			}
		}
		function reloadTable(){
			if($(".selectTable").length>0){
				//$('.selectTable').removeAllRow();
				$('.selectTable').flexOptions({
					url : "../common/jdServiceShopController/getShopList",
					 dataType: 'json',
					  params: [
					           {'name':'province','value':$("#province").val()},
					           {'name':'city','value':$("#city").val()},
					           {'name':'county','value':$("#county").val()},	
					           {'name':'town','value':$("#town").val()},
					           {'name':'shopName','value':$("#shopName").val()},
					           {'name':'areaNo','value':areaNo},
					           {'name':'operateCenterNo','value':operateCenterNo},
					           {'name':'tableCol','value':	JSON.stringify(tableCol)}
					     ],
					     newp : "1"
				}).flexReload();;
			}
		}
});