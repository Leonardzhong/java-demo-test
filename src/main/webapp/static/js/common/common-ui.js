var CommonUI = (function(){
	org_dc = null;
	level4Address = null;
	org_dc_wh = null;
	org_dc_wh_carrier = null;
	return {
		level4AddressUI : level4Address,		//四级地址控件
		orgDcUI : org_dc,						//机构-配送中心控件
		orgDcWhUI : org_dc_wh,					//机构-配送中心-仓库控件
		orgDcWhCarrierUI : org_dc_wh_carrier
	};
})();

CommonUI.level4AddressUI = (function(){
	var PROVINCE_ID = "common_province";
	var CITY_ID = "common_city";
	var COUNTY_ID = "common_county";
	var TOWN_ID = "common_town";
	
	/*加载四级地址*/
	var loadUI = function(placeholder){
		$("#"+placeholder).html("\
				<div>\
					<span>四级地址</span>\
					<select  name=\"province\" id=\""+PROVINCE_ID+"\" class=\"input-style\" style=\"width:75px;\">\
						<option value=\"\" >省</option>\
					</select>\
					<select name=\"city\" id=\""+CITY_ID+"\" style=\"width:75px;margin-left:-5px;\" class=\"input-style\" >\
						<option value=\"\" >市</option>\
					</select>\
					<select name=\"county\" id=\""+COUNTY_ID+"\" style=\"width:75px;margin-left:-5px;\" class=\"input-style\" >\
						<option value=\"\" >县</option>\
					</select>\
					<select name=\"town\" id=\""+TOWN_ID+"\" style=\"width:75px;margin-left:-5px;\" class=\"input-style\" >\
						<option value=\"\" >镇</option>\
					</select>\
				</div>");
				$("#"+placeholder).append("<script>\
					$(\"#"+PROVINCE_ID+"\").on(\'change\',function(){\
					$(\"#"+CITY_ID+"\").html(\"<option value=\'\'>市</option>\");\
					$(\"#"+COUNTY_ID+"\").html(\"<option value=\'\'>县</option>\");\
					$(\"#"+TOWN_ID+"\").html(\"<option value=\'\'>镇</option>\");\
					province = $(this).val();\
					if(province == \'\'){\
						return false;\
					}\
					$.ajax({\
						url : \'../common/getUserCitiesByProvinceNo\',\
						data:\'provinceNo=\'+province, \
						type : \'POST\',\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].areaNo+\"\'>\"+data[i].areaName+\"</option>\").appendTo($(\"#"+CITY_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取市信息失败!\");\
						}\
					});\
				});\
				$(\"#"+CITY_ID+"\").on(\'change\',function(){\
					$(\"#"+COUNTY_ID+"\").html(\"<option value=\'\'>县</option>\");\
					$(\"#"+TOWN_ID+"\").html(\"<option value=\'\'>镇</option>\");\
					city = $(this).val();\
					if(city == \'\'){\
						return false;\
					}\
					$.ajax({\
						url : \'../common/getCountyInfo\',\
						data:\'city=\'+city, \
						type : \'POST\',\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].areaNo+\"\'>\"+data[i].areaName+\"</option>\").appendTo($(\"#"+COUNTY_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取县信息失败!\");\
						}\
					});\
				});\
				$(\"#"+COUNTY_ID+"\").on(\'change\',function(){\
					$(\"#"+TOWN_ID+"\").html(\"<option value=\'\'>镇</option>\");\
					county = $(this).val();\
					if(county == \'\'){\
						return false;\
					}\
					$.ajax({\
						url : \'../common/getTownInfo\',\
						data:\'county=\'+county, \
						type : \'POST\',\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].areaNo+\"\'>\"+data[i].areaName+\"</option>\").appendTo($(\"#"+TOWN_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取镇信息失败!\");\
						}\
					});\
				});</script>");
				
				$("#"+placeholder).append("<script>\
					$.ajax({\
						url : \'../common/getUserProvince\',\
						type : \'GET\',\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].areaNo+\"\'>\"+data[i].areaName+\"</option>\").appendTo($(\"#"+PROVINCE_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取市信息失败!\");\
						}\
					});\
				</script>");
	};
		
	var regProvinceEvent = function(eventName,wigetId,type){
		$("#"+wigetId).on(eventName,function(){
			
			$("#"+PROVINCE_ID).html("<option value=''>省</option>");
			$("#"+CITY_ID).html("<option value=''>市</option>");
			$("#"+COUNTY_ID).html("<option value=''>县</option>");
			$("#"+TOWN_ID).html("<option value=''>镇</option>");
			if(type == CommonUI.level4AddressUI.onChangeType.DC_TYPE){
				provinceURL = '../common/getProvinceByDc?dcNo='+$("#"+wigetId).val();
			}else{
				provinceURL = '../common/getUserProvince';
			}
			$.ajax({
				url : provinceURL,
				success : function(data){
					for(var i = 0 ; i < data.length; i++){
						$("<option value='"+data[i].areaNo+"'>"+data[i].areaName+"</option>").appendTo($("#"+PROVINCE_ID));
					}
				}
			});
		});
	};
	
	var onchangeType = (function(){
		var dcType = "DC_TYPE";
		var otherType = "OTHER_TYPE";
		
		return{
			DC_TYPE : dcType,
			OTHER_TYPE : otherType
		};
		
	})();
	
	return{
		load : loadUI,
		regProvinceListen : regProvinceEvent,
		onChangeType : onchangeType,
		PROVINCE_NO : PROVINCE_ID,
		CITY_NO : CITY_ID,
		COUNTY_NO : COUNTY_ID,
		TOWN_NO : TOWN_ID
	};
	
})();

CommonUI.orgDcUI = (function(){
	var org_id = "organizations";
	var dc_id = "distributionCentres";
	
	var loadUI = function(placeholder){
		var ORG_ID = "organizations";
		var DC_ID = "distributionCentres";
		$("#"+placeholder).html("\
		<span style=\"padding-left:25px;\">机构</span>\
		<select name=\"orgId\" id=\""+ORG_ID+"\" class=\"input-style\" style=\"width:100px;\" >\
			<option value=\"\" >请选择</option>\
		</select>\
		\
		<span style=\"padding-left:25px;\">配送中心</span>\
		<select name=\"dcId\" id=\""+DC_ID+"\" class=\"input-style\" style=\"width:100px;\"  >\
			<option value=\"\" >请选择</option>\
		</select>");
		
		$("#"+placeholder).append("<script> \
		$(\"#"+ORG_ID+"\").on(\'change\',function(){\
			$(\"#"+DC_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
			orgNo = $(this).val();\
			if(orgNo == \'\'){\
				return false;\
			}\
			$.ajax({\
				url : \'../common/getUserDCByOrgNo?orgNo=\'+orgNo,\
				dataType : \'json\',\
				success : function(data) {\
					if(data.length>0){\
						for(var i=0;i<data.length;i++){\
							$(\"<option value=\'\"+data[i].distributeNo+\"\'>\"+data[i].dcName+\"</option>\").appendTo($(\"#"+DC_ID+"\"));\
						}\
					}else{\
						\
					}\
				},\
				error:function(data){\
	               alert(\"获取配送中心信息失败!\");\
				}\
			});\
		});\
		</script>");
		
		$("#"+placeholder).append("<script>\
			$.ajax({\
			url:\'../common/getUserOrg\',\
			data : {},\
			dataType : \'json\',\
			success : function(data){\
				if(data.length>0){\
					for(var i=0;i<data.length;i++){\
						$(\"<option value=\'\"+data[i].orgNo+\"\'>\"+data[i].organName+\"</option>\").appendTo($(\"#"+ORG_ID+"\"));\
					}\
				}else{\
					\
				}\
			}});\
		</script>\
		");
	
	};
	
	return{
		load : loadUI,
		ORG_ID : org_id,
		DC_ID : dc_id
	};
	
})();


CommonUI.orgDcWhUI =(function(){
	var org_id = "organizations";
	var dc_id = "distributionCentres";
	var wh_id = "warehouses";
	var loadUI = function(placeholder){
		var ORG_ID = "organizations";
		var DC_ID = "distributionCentres";
		var WH_ID = "warehouses";
		$("#"+placeholder).html("\
		<span style=\"padding-left:25px;\">机构</span>\
		<select name=\"orgId\" id=\""+ORG_ID+"\" class=\"input-style\" style=\"width:100px;\" >\
			<option value=\"\" >请选择</option>\
		</select>\
		\
		<span style=\"padding-left:25px;\">配送中心</span>\
		<select name=\"dcId\" id=\""+DC_ID+"\" class=\"input-style\" style=\"width:100px;\"  >\
			<option value=\"\" >请选择</option>\
		</select>\
		<span style=\"padding-left:25px;\">仓库</span>\
		<select name=\"whId\" id=\""+WH_ID+"\" class=\"input-style\"  style=\"width:100px;\" >\
			<option value=\"\" >请选择</option>\
		</select>");
		
		
		$("#"+placeholder).append("<script> \
		$(\"#"+ORG_ID+"\").on(\'change\',function(){\
			$(\"#"+DC_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
			$(\"#"+WH_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
			orgNo = $(this).val();\
			if(orgNo == \'\'){\
				return false;\
			}\
			$.ajax({\
				url : \'../common/getUserDCByOrgNo?orgNo=\'+orgNo,\
				dataType : \'json\',\
				success : function(data) {\
					if(data.length>0){\
						for(var i=0;i<data.length;i++){\
							$(\"<option value=\'\"+data[i].distributeNo+\"\'>\"+data[i].dcName+\"</option>\").appendTo($(\"#"+DC_ID+"\"));\
						}\
					}else{\
						\
					}\
				},\
				error:function(data){\
	               alert(\"获取配送中心信息失败!\");\
				}\
			});\
		});\
		\
		$(\"#"+DC_ID+"\").on(\'change\',function(){\
			$(\"#"+WH_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
			dcNo = $(this).val();\
			if(dcNo == \'\'){\
				return false;\
			}\
			$.ajax({\
				url : \'../common/getWarehouseByDc?dcNo=\'+dcNo,\
				dataType : \'json\',\
				success : function(data) {\
					if(data.length>0){\
						for(var i=0;i<data.length;i++){\
							$(\"<option value=\'\"+data[i].warehouseNo+\"\'>\"+data[i].warehouseName+\"</option>\").appendTo($(\"#"+WH_ID+"\"));\
						}\
					}else{\
						\
					}\
				},\
				error:function(data){\
	               alert(\"获取仓库信息失败!\");\
				}\
			});\
		});\
		</script>");
		
		$("#"+placeholder).append("<script>\
			$.ajax({\
			url:\'../common/getUserOrg\',\
			data : {},\
			dataType : \'json\',\
			success : function(data){\
				if(data.length>0){\
					for(var i=0;i<data.length;i++){\
						$(\"<option value=\'\"+data[i].orgNo+\"\'>\"+data[i].organName+\"</option>\").appendTo($(\"#"+ORG_ID+"\"));\
					}\
				}else{\
					\
				}\
			}});\
		</script>\
		");
	
	};
	
	return{
		load : loadUI,
		ORG_ID : org_id,
		DC_ID : dc_id,
		WH_ID : wh_id
	};
	
})();

CommonUI.orgDcWhCarrierUI=(function(){
	var org_id = "organizations";
	var dc_id = "distributionCentres";
	var wh_id = "warehouses";
	var carrier_id = "carriers";
	loadUI = function(placeholder){
		var ORG_ID = "organizations";
		var DC_ID = "distributionCentres";
		var WH_ID = "warehouses";
		var CARRIER_ID = "carriers";
		$("#"+placeholder).html("\
				<span style=\"padding-left:25px;\">机构</span>\
				<select name=\"orgId\" id=\""+ORG_ID+"\" class=\"input-style\" style=\"width:100px;\" >\
					<option value=\"\" >请选择</option>\
				</select>\
				\
				<span style=\"padding-left:25px;\">配送中心</span>\
				<select name=\"dcId\" id=\""+DC_ID+"\" class=\"input-style\" style=\"width:100px;\"  >\
					<option value=\"\" >请选择</option>\
				</select>\
				<span style=\"padding-left:25px;\">仓库</span>\
				<select name=\"whId\" id=\""+WH_ID+"\" class=\"input-style\"  style=\"width:100px;\" >\
					<option value=\"\" >请选择</option>\
				</select>\
				<span style=\"padding-left:25px;\">承运商</span>\
				<select name=\"carriers\" id=\""+CARRIER_ID+"\" class=\"input-style\" style=\"width:100px;\" >\
				<option value=\'\'>请选择</option>\
				</select>"
				);
				
				
				$("#"+placeholder).append("<script> \
				$(\"#"+ORG_ID+"\").on(\'change\',function(){\
					$(\"#"+DC_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
					$(\"#"+WH_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
					$(\"#"+CARRIER_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
					orgNo = $(this).val();\
					if(orgNo == \'\'){\
						return false;\
					}\
					$.ajax({\
						url : \'../common/getUserDCByOrgNo?orgNo=\'+orgNo,\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].distributeNo+\"\'>\"+data[i].dcName+\"</option>\").appendTo($(\"#"+DC_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取配送中心信息失败!\");\
						}\
					});\
				});\
				\
				$(\"#"+DC_ID+"\").on(\'change\',function(){\
					$(\"#"+WH_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
					$(\"#"+CARRIER_ID+"\").html(\"<option value=\'\'>请选择</option>\");\
					dcNo = $(this).val();\
					if(dcNo == \'\'){\
						return false;\
					}\
					$.ajax({\
						url : \'../common/getWarehouseByDc?dcNo=\'+dcNo,\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].warehouseNo+\"\'>\"+data[i].warehouseName+\"</option>\").appendTo($(\"#"+WH_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
			               alert(\"获取仓库信息失败!\");\
						}\
					});\
					$.ajax({\
						url : \'../common/getCarrier\',\
						data:\'dcId=\'+dcNo,\
						type : \'POST\',\
						dataType : \'json\',\
						success : function(data) {\
							if(data.length>0){\
								for(var i=0;i<data.length;i++){\
									$(\"<option value=\'\"+data[i].carrierId+\"\'>\"+data[i].carrierName+\"</option>\").appendTo($(\"#"+CARRIER_ID+"\"));\
								}\
							}else{\
								\
							}\
						},\
						error:function(data){\
						}\
					});\
				});\
				</script>");
				
				
				
				$("#"+placeholder).append("<script>\
					$.ajax({\
					url:\'../common/getUserOrg\',\
					data : {},\
					dataType : \'json\',\
					success : function(data){\
						if(data.length>0){\
							for(var i=0;i<data.length;i++){\
								$(\"<option value=\'\"+data[i].orgNo+\"\'>\"+data[i].organName+\"</option>\").appendTo($(\"#"+ORG_ID+"\"));\
							}\
						}else{\
							\
						}\
					}});\
				</script>\
				");
	};
	
	return{
		load : loadUI,
		ORG_ID : org_id,
		DC_ID : dc_id,
		WH_ID : wh_id,
		CARRIER_ID : carrier_id
	}
})();
