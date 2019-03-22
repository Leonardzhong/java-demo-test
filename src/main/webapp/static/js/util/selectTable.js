$(document).ready(function() {

	var width = $(window).width();
	if(width<900){
		width=900;
	}
	$("#selectResult").attr("style","width:"+width+"px;float:left;");
	$("#selectTable").parent().attr("style","width:"+width+"px;float:left;");
	//$("#selectTable").attr("style","width:"+width+"px;float:left;");

	var smallWindow=$("#selectResult").smallWindow({
		height:25,
		closeCallBack:function(id){
			$('.selectTable').closeCheckBox(id);
		}
	});

	$('.selectTable').flexigrid({
		idProperty: idProperty,
		textProperty:textProperty,
		height: 320,
		showToggleBtn: false,
		resizable: true,
		colMove: true,
		usepager: true,
		checkbox: true,
		colModel : tableCol,
		selectCallBack:function(arrs,isSelectFlag,idSingle){
			if(isSelectFlag){
				var msgArray=new Array();
				for(i=0;i<arrs.length;i++){
					var json=arrs[i];
					var value=json.value;
					var text=json.textbook;
					var isExistFlag=smallWindow.smallWindow('isExistSmallWindow',value);
					if(isExistFlag){
						if(idSingle){//全选不提示，单选才提示
							msgArray.push(text);
						}
					}else{
						smallWindow.smallWindow('addWindow',value,text);
					}
				}
				var msg="";
				for(i=0;i<msgArray.length;i++){
					msg=msg+msgArray[i]+",";
				}
				if(msg!=""){
					alert("名称："+msg+"已经存在");
				}
			}else{
				for(i=0;i<arrs.length;i++){
					var json=arrs[i];
					var value=json.value;
					smallWindow.smallWindow('closeById',value);
				}
			}
		},
		loadCompleteCallBack:function(){
			var arrId=smallWindow.smallWindow('getAllId');
			if(arrId!=null && arrId.length>0){
				for(i=0;i<arrId.length;i++){
					var id=arrId[i];
					$('.selectTable').selectCheckBox(id);
				}
			}
		},
		onSubmit:function() {
			rowSequence = 0;
			return true;
		 }
	});
});