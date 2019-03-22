/*
 *  公共js
 *  2014-06-30 Justin创建
 *  */


	(function(){ 
		var _alert = window.alert;
		window.alert = function(alertContent,flag){
			if(flag==true){
				_alert(alertContent);
				return;
			}
			if($("#alertDialog").length>0){
	    		$("#alertDialogBody").html(alertContent);
	    	}else{
		    	var modal = '<div class="modal fade" id="alertDialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-left:250px;margin-top:180px; z-index: 9999;">'
		  		  +'<div class="modal-dialog">'
		  		  +' <div class="modal-content" style="width:320px;">'
		  		  +'  <div class="modal-header" style="height:40px;">'
		  		  +'    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
		  		  +'     <h4 class="modal-title" id="myModalLabel">温馨提示</h4>'
		  		  +'</div>'
		  		  +'<div class="modal-body" style="height:120px;" id="alertDialogBody">'
		  		  +alertContent
		  		  +'</div>'
		  		  +'<div class="modal-footer" style="height:30px;">'
		  		  +'  <div style="margin-top:-12px;"><button type="button" class="btn btn-info" data-dismiss="modal">确定</button></div>'
		  		  +'</div>'
		  		  +'</div>'
		  		  +'</div>'
		  		  +'</div>';
		      	}
		      	$(modal).appendTo("body");
		      	$("#alertDialog").modal();   
	    	};
	    	
	    	madsConfirm = function(confirmContent,successFunc){
	    		if($("#confirmDialog").length>0){
	        		$("#confirmDialogBody").html(confirmContent);
	        	}else{
	        		sf = successFunc;
	        		hide = function(){$("#confirmDialog").modal("hide")};
	        		var modal = '<div class="modal fade" id="confirmDialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-left:250px;margin-top:180px;">'
	    	  		  +'<div class="modal-dialog">'
	    	  		  +' <div class="modal-content" style="width:450px;">'
	    	  		  +'  <div class="modal-header" style="height:40px;">'
	    	  		  +'    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
	    	  		  +'     <h4 class="modal-title" id="myModalLabel">谨慎选择</h4>'
	    	  		  +'</div>'
	    	  		  +'<div class="modal-body" style="height:120px;" id="alertDialogBody">'
	    	  		  +confirmContent
	    	  		  +'</div>'
	    	  		  +'<div class="modal-footer" style="height:30px;">'
	    	  		  +'<div style="margin-top:-12px;"><button type="button" class="btn btn-info active" data-dismiss="modal"  autofocus="autofocus">取消</button>'
	    	  		  +'<button type="button" class="btn  btn-info btn-warning" onclick="hide();sf();" >确定</button></div>'
	    	  		  +'</div>'
	    	  		  +'</div>'
	    	  		  +'</div>'
	    	  		  +'</div>';
//	    	    	modal += '<script type="text/javascript"></script>'
	    	      	}
	    	      	$(modal).appendTo("body");
	    	      	$("#confirmDialog").modal();   	    		
	    	};
	    	
		})();


    $.queryDetail = function (fId){
    	if($("#orderDetailPlugin").length>0){
    		
    	}else{
	    	var modal = '<div class="modal fade" id="orderDetailPlugin" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
		  +'<div class="modal-dialog">'
		  +' <div class="modal-content" style="width:1000px;">'
		  +'  <div class="modal-header" style="height:230px;">'
		  +'    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
		  +'     <h4 class="modal-title" id="myModalLabel">订单详情</h4>'
		  +'	<div style="margin-top:10px;height:200px;overflow:scroll;">		'
		  +'		<table class="table table-hover table-bordered table-striped table-condensed" style="text-align:center; valign:middle;">'
		  +'			<thead class="thead-style"    id="orderHeader">'
		  +'			</thead>'
//		  +'		</table>	'
//		  +'	</div>	'
//		  +'<div class="row-fluid"  style="margin-top:-20px;height:150px;overflow:scroll;">'
//		  +'	<div>'
//		  +'		<table class="table table-hover table-bordered table-striped table-condensed" style="text-align:center; valign:middle;table-layout:fixed">'
		  +'			<tbody class="tbody-style"    id="orderDetail">'
		  +'			</tbody>'
		  +'		</table>'
//		  +'	</div>'
		  +'</div>	'
     
		  +'</div>'
		  +'<div class="modal-body">'
		  +'<div	>'
		  +'			<table class="table table-hover table-bordered table-striped table-condensed" style="text-align:center; valign:middle;">'
		  +'		<thead class="thead-style" >'
		  +'			<tr>'
		  +'				<th style="width:10%;text-align:center; valign:middle;"> 商品编号 </th>'
		  +'				<th style="width:53%;text-align:center; valign:middle;"> 商品名称 </th>'
		  +'				<th style="width:9%;text-align:center; valign:middle;">数量 </th>'
		  +'				<th style="width:9%;text-align:center; valign:middle;"> 总重量 </th>'
		  +'				<th style="width:9%;text-align:center; valign:middle;"> 总体积 </th>'
		  +'				<th style="text-align:center; valign:middle;">需要安装 </th>'
		  +'				<th style="width:18px;text-align:center; valign:middle;"></th>'		  
		  +'			</tr>'
		  +'		</thead>'
		  +'	</table>	'
		  +'</div>	'
		  +'<div class="row-fluid"  style="margin-top:-20px;height:250px;overflow:scroll;">'
		  +'	<div>'
		  +'		<table class="table table-hover table-bordered table-striped table-condensed" style="text-align:center; valign:middle;">'
		  +'			<tbody class="tbody-style"    id="productDetail">'
		  +'			</tbody>'
		  +'		</table>'
		  +'	</div>'
		  +'</div>	'		   
		  +'</div>'
		  +'<div class="modal-footer">'
		  +'  <button type="button" class="btn btn-info" data-dismiss="modal">确定</button>'
		  +'</div>'
		  +'</div>'
		  +'</div>'
		  +'</div>';
    	}
    	$(modal).appendTo("body");
    	var f= $("#"+fId);
    	f.on('click',(".queryDetailUrl"),function(){
    		$.ajax({
    			url : '../common/queryOrderDetailPlugin',
    			data:'sysno='+$(this).prop("id"), 
    			type : 'GET',
    			dataType : 'json',
    			contentType : 'application/json; charset=utf-8',
    			success : function(result) {
    	    		$("#orderDetailPlugin").modal();   
    	    		var data = result.OI;
    				var data2= result.OM;
    				if(data2.scheduleType == 1){
	    	    		var htm = ' ';
	    				for(var i=0;i<data.length;i++){
	    					htm +="<tr>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data[i].productId+"</td>"+
	    					"<td style=\"width:53%;text-align:left; valign:middle;\">"+data[i].productName+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productQty+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productWeight+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\"> "+(data[i].productVolume==null?0:parseFloat(data[i].productVolume/1000000000).toFixed(4))+"</td>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\"> "+(data[i].isFitService=="1"?"是":"否")+"</td>"+
	    					"</tr>";
	    				}
	    				$("#productDetail").html(htm);    	    	
	    				var htm3 = 	'<tr>'
	        				  +'<th style="width:10%;text-align:center; valign:middle;">订单号</th>'
	        				  +'<th style="width:9%;text-align:center; valign:middle;">下单时间</th>'		  
	        				  +'<th style="width:18%;text-align:center; valign:middle;"> 电话 </th>'
	        				  +'<th style="width:10%;text-align:center; valign:middle;"> 联系人 </th>'
	        				  +'<th style="text-align:center; valign:middle;"> 承运商 </th>' 
	        				  +'<th style="width:9%;text-align:center; valign:middle;"> 应收金额 </th>'
	        				  +'<th style="width:9%;text-align:center; valign:middle;"> 支付方式 </th>'
	        				  +'<th style="width:9%;text-align:center; valign:middle;"> 付款方式 </th>'  
	        				  +'<th style="width:8%;text-align:center; valign:middle;"> 电子发票 </th>' 
	        				  +'</tr>' ;  					
	        				$("#orderHeader").html(htm3);  
	    				var htm2 = '';
	    				htm2 +="<tr>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.orderId+"</td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.receiveTime+"</td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.reserveCustomerPhone+"</td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.reserveCustomerName+"</td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.carrierName+"</td>"+
	    					"<td style=\"text-align:right; valign:middle;\"> "+data2.userTruePay+"</td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.idPaymentTypeName+" </td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+data2.idPaymentWayName+" </td>"+
	    					"<td style=\"text-align:left; valign:middle;\">"+result.isElectricInvoice+" </td>"+
	    					"</tr>";
	    				htm2 += "<tr>"+
						"<td style=\"width:10%;text-align:left; valign:middle;\">地址</td>"+
						"<td style=\"text-align:left; valign:middle;\"  colspan=\"8\">"+data2.reserveDetailAddress+"</td>"+    					
						"</tr>";    			    				
	    				htm2 += "<tr>"+
						"<td style=\"width:10%;text-align:left; valign:middle;\">预约备注</td>"+
						"<td style=\"text-align:left; valign:middle;\"  colspan=\"8\">"+data2.reserveNote+"</td>"+    					
						"</tr>";    				
	    				$("#orderDetail").html(htm2);     

    	    		}else if(data2.scheduleType == 2){
    	    			var htm = ' ';
	    				for(var i=0;i<data.length;i++){
	    					htm +="<tr>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data[i].productId+"</td>"+
	    					"<td style=\"width:53%;text-align:left; valign:middle;\">"+data[i].productName+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productQty+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productWeight+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\"> "+(data[i].productVolume==null?0:parseFloat(data[i].productVolume/1000000000).toFixed(4))+"</td>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\"> "+(data[i].isFitService=="1"?"是":"否")+"</td>"+
	    					"</tr>";
	    				}
    				$("#productDetail").html(htm);    	    
    				var htm3 = 	'<tr>'
      				  +'<th style="width:10%;text-align:center; valign:middle;">订单号</th>'
    				  +'<th style="width:9%;text-align:center; valign:middle;">下单时间</th>'		
      				  +'<th style="width:14%;text-align:center; valign:middle;"> 电话 </th>'
      				  +'<th style="width:10%;text-align:center; valign:middle;"> 联系人 </th>'
      				  +'<th style="width:9%;text-align:center; valign:middle;">承运商 </th>'
      				  +'<th style="width:8%;text-align:center; valign:middle;"> 应收金额 </th>'
      				  +'<th style="width:8%;text-align:center; valign:middle;"> 支付方式 </th>'
      				  +'<th style="width:8%;text-align:center; valign:middle;"> 付款方式 </th>'      				  
      				  +'<th style="width:9%;text-align:center; valign:middle;"> 服务单号 </th>'
      				  +'<th style="text-align:center; valign:middle;"> 备注信息 </th>'    				  
      				  +'</tr>' ;  					
      				$("#orderHeader").html(htm3);   
    				var htm2 = '';
    				htm2 +="<tr>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.orderId+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.receiveTime+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.reserveCustomerPhone+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.reserveCustomerName+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.carrierName+"</td>"+    					
    					"<td style=\"text-align:right; valign:middle;\">"+data2.userTruePay+" </td>"+
    					"<td style=\"text-align:left; valign:middle;\"> "+data2.idPaymentTypeName+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\"> "+data2.idPaymentWayName+"</td>"+    					
    					"<td style=\"text-align:left; valign:middle;\">"+data2.amsServiceNo+" </td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.amsAuditComment+" </td>"+    					
    					"</tr>";
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">地址</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"9\">"+data2.reserveDetailAddress+"</td>"+    					
					"</tr>";    
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">预约备注</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"9\">"+data2.reserveNote+"</td>"+    					
					"</tr>";    				
    				$("#orderDetail").html(htm2);     
    				}else if(data2.scheduleType == 3){
    					var htm = ' ';
	    				for(var i=0;i<data.length;i++){
	    					htm +="<tr>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data[i].productId+"</td>"+
	    					"<td style=\"width:53%;text-align:left; valign:middle;\">"+data[i].productName+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productQty+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productWeight+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\"> "+(data[i].productVolume==null?0:parseFloat(data[i].productVolume/1000000000).toFixed(4))+"</td>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\"> "+(data[i].isFitService=="1"?"是":"否")+"</td>"+
	    					"</tr>";
	    				}
    				$("#productDetail").html(htm);    	    
    				var htm3 = 	'<tr>'
      				  +'<th style="width:11%;text-align:center; valign:middle;">订单号</th>'
      				  +'<th style="width:13%;text-align:center; valign:middle;"> 配出配送中心 </th>'
      				  +'<th style="width:23%;text-align:center; valign:middle;"> 配出库房 </th>'      				  
      				  +'<th style="width:13%;text-align:center; valign:middle;"> 目的配送中心 </th>'    		
      				  +'<th style="width:23%;text-align:center; valign:middle;"> 目的库房 </th>'         
      				  +'<th style="width:17%;text-align:center; valign:middle;"> 接收时间 </th>'              				  
      				  +'</tr>' ;  					
      				$("#orderHeader").html(htm3);      	
    				var htm2 = '';
    				htm2 +="<tr>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.orderId+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.dcName+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.whName+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.toDcName+"</td>"+
    					"<td style=\"text-align:right; valign:middle;\">"+data2.toWhName+" </td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.createTime+" </td>"+
    					"</tr>";
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">地址</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"5\">"+data2.reserveDetailAddress+"</td>"+    					
					"</tr>";    	
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">预约备注</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"5\">"+data2.reserveNote+"</td>"+    					
					"</tr>";    				
    				$("#orderDetail").html(htm2);     
				
    				}else if(data2.scheduleType == 4){
    					var htm = ' ';
	    				for(var i=0;i<data.length;i++){
	    					htm +="<tr>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data[i].productId+"</td>"+
	    					"<td style=\"width:53%;text-align:left; valign:middle;\">"+data[i].productName+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productQty+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data[i].productWeight+"</td>"+
	    					"<td style=\"width:9%;text-align:right; valign:middle;\"> "+(data[i].productVolume==null?0:parseFloat(data[i].productVolume/1000000000).toFixed(4))+"</td>"+
	    					"<td style=\"width:10%;text-align:left; valign:middle;\"> "+(data[i].isFitService=="1"?"是":"否")+"</td>"+
	    					"</tr>";
	    				}
    				$("#productDetail").html(htm);    	    
    				var htm3 = 	'<tr>'
      				  +'<th style="width:10%;text-align:center; valign:middle;">订单号</th>'
    				  +'<th style="width:12%;text-align:center; valign:middle;">配送中心</th>'		
      				  +'<th style="width:14%;text-align:center; valign:middle;"> 仓库 </th>'
      				  +'<th style="width:9%;text-align:center; valign:middle;"> 供应商简码 </th>'
      				  +'<th style="text-align:center; valign:middle;">供应商名称 </th>'
      				  +'<th style="width:9%;text-align:center; valign:middle;"> 联系人 </th>'
      				  +'<th style="width:15%;text-align:center; valign:middle;"> 电话 </th>'      				  
      				  +'<th style="width:10%;text-align:center; valign:middle;"> 预约送货时间 </th>'
      				  +'</tr>' ;  					
      				$("#orderHeader").html(htm3);      	
    				var htm2 = '';
    				htm2 +="<tr>"+
    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data2.orderId+"</td>"+
    					"<td style=\"width:12%;text-align:left; valign:middle;\">"+data2.dcName+"</td>"+
    					"<td style=\"width:14%;text-align:left; valign:middle;\">"+data2.whName+"</td>"+
    					"<td style=\"width:9%;text-align:left; valign:middle;\">"+data2.providerCode+"</td>"+
    					"<td style=\"text-align:left; valign:middle;\">"+data2.providerName+"</td>"+    					
    					"<td style=\"width:9%;text-align:right; valign:middle;\">"+data2.reserveCustomerName+" </td>"+
    					"<td style=\"width:15%;text-align:left; valign:middle;\">"+data2.reserveCustomerPhone+" </td>"+    					
    					"<td style=\"width:10%;text-align:left; valign:middle;\">"+data2.reserveDeliverTime+" </td>"+
    					"</tr>";
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">地址</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"7\">"+data2.reserveDetailAddress+"</td>"+    					
					"</tr>";    	
    				htm2 += "<tr>"+
					"<td style=\"width:10%;text-align:left; valign:middle;\">预约备注</td>"+
					"<td style=\"text-align:left; valign:middle;\"  colspan=\"7\">"+data2.reserveNote+"</td>"+    					
					"</tr>";    				
    				$("#orderDetail").html(htm2);     
				
    				}
    			},
    			error:function(data){
                   alert("调用失败");
                   return false;
    			}
    		});
	
    	});
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    