$(document).ready(function(){
	if($("#province").length>0){
			$.ajax({
				url : '../common/fourGradeAddressController/getFourGradeAddressByParentNo',
				data:'parentNo=0', 
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							$("<option value='"+data[i].areaId+"'>"+data[i].areaName+"</option>").appendTo($("#province"));
						}
					}
				},
				error:function(data){
	               alert("获取市信息失败!");
				}
			});
		}
		
		//查询四级地址联动
		$("#province").on('change',function(){
			$("#city").html("<option value=''>市</option>");
			$("#county").html("<option value=''>县</option>");
			$("#town").html("<option value=''>镇</option>");
			province = $(this).val();
			if(province == ''){
				return false;
			}
			$.ajax({
				url : '../common/fourGradeAddressController/getFourGradeAddressByParentNo',
				data:'parentNo='+province, 
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					//alert(data);
					/*$("<option value='1'>1市</option>").appendTo($("#city"));
					$("<option value='2'>2市</option>").appendTo($("#city"));
					$("<option value='3'>3市</option>").appendTo($("#city"));*/
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							$("<option value='"+data[i].areaId+"'>"+data[i].areaName+"</option>").appendTo($("#city"));
						}
					}
				},
				error:function(data){
	               alert("获取市信息失败!");
				}
			});
		});
		$("#city").on('change',function(){
			$("#county").html("<option value=''>县</option>");
			$("#town").html("<option value=''>镇</option>");
			city = $(this).val();
			if(city == ''){
				return false;
			}
			$.ajax({
				url : '../common/fourGradeAddressController/getFourGradeAddressByParentNo',
				data:'parentNo='+city, 
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					/*$("<option value='1'>1县</option>").appendTo($("#county"));
					$("<option value='2'>2县</option>").appendTo($("#county"));
					$("<option value='3'>3县</option>").appendTo($("#county"));*/
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							//alert(data[i].areaNo);
							//alert(data[i].areaName);
							$("<option value='"+data[i].areaId+"'>"+data[i].areaName+"</option>").appendTo($("#county"));
						}
					}
				},
				error:function(data){
	               alert("获取县信息失败!");
				}
			});
		});
		$("#county").on('change',function(){
			$("#town").html("<option value=''>镇</option>");
			county = $(this).val();
			if(county == ''){
				return false;
			}
			$.ajax({
				url : '../common/fourGradeAddressController/getFourGradeAddressByParentNo',
				data:'parentNo='+county, 
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					/*$("<option value='1'>1镇</option>").appendTo($("#town"));
					$("<option value='2'>2镇</option>").appendTo($("#town"));
					$("<option value='3'>3镇</option>").appendTo($("#town"));*/
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							$("<option value='"+data[i].areaId+"'>"+data[i].areaName+"</option>").appendTo($("#town"));
						}
					}
				},
				error:function(data){
	               alert("获取镇信息失败!");
				} 
			});
		});
});	