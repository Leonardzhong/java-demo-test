var manulsidebar=null;
$(document).ready(function() {
	var height = $(window).height();
	if(height<600){
		height=600;
	}
	var resourceCode=$("#resourceCode").val();
	init_menu(resourceCode);
	//创建菜单
	manulsidebar=$("#lsidebar").lsidebar({id:"lsidebar",
		callback:{
			onclick:numuClick
		}
	});

	$("#centerFrame").attr('height', height);

	//初始化菜单
	function init_menu(resourceCode){
		resourceCode =resourceCode||"";
		//创建菜单
		manulsidebar=$("#lsidebar").lsidebar({id:"lsidebar",
			callback:{
				onclick:numuClick
			}
		});
		manulsidebar.refresh(resourceCode);
	}

	function numuClick(munu){
		$("#content_middle").hide();
		$("#centerFrame").show();
		$("#centerFrame").attr("src",munu.resourceUrl)
	}

	function getSiteByUrl(url,type){
		var munu={};
		munu.resourceUrl=url;
		numuClick(munu);
	}

	$(".list-group a").click(function(e){
		e.preventDefault();

		if(this.attributes['url']){
			var resourceCode=$("#resourceCode").val();
			init_menu(resourceCode);
			getSiteByUrl(this.attributes['url'].nodeValue);
			//switchFrame(this.attributes['url'].nodeValue);
			switchActiveButtonCss("#"+this.id);
		}
	});

	function switchFrame(url){
		$('#centerFrame', document).attr("src",url);
	}

	//$('#ftpManagement').click();
	function switchActiveButtonCss(id){
		$(".list-group-item").attr("style","");
		$(id).attr("style","background:#F5F5F5");
		//$(".list-group-item clickBtn").removeClass('active');
		//$(id).parent().addClass('active');
	}

	if($("#page1")){
		//$("#page1").click();
	}
});