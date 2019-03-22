(function($){
	$.fn.drag=function(options){
		var defaults = { 
			  }; 
		var opts = $.extend({}, defaults, options);
		
		var _move=false;
		
		var _x,_y;
		
		var rect=[0,0,0,0]; //[left,top,right,bottom]
		
		return this.each(function(){
			var $this = $(this);
			
			//筛选要拖动的位置
			var dragEl = ( opts.handle == null ? $this:$this.find(opts.handle) );
			
			//拖动范围计算
			rect=[0,0,$(document).width(),window.innerHeight];
			dragEl.click(function(){
		        }).mousedown(function(e){
		        _move=true;
		        _x=e.pageX-parseInt($this.css("left"));
		        _y=e.pageY-parseInt($this.css("top"));
		    });
			$(document).mousemove(function(e){
		        if(_move){
		            var x=e.pageX-_x;
		            var y=e.pageY-_y;
		            
		            if(x <= rect[0] ) x = rect[0];
		            if(y <= rect[1] ) y = rect[1];
		            
		            if( x + $this.width() > rect[2]) x=rect[2] -$this.width();
		            if( y + $this.height() > rect[3]) y=rect[3]-$this.height();
		            
		            $this.css({top:y,left:x});
		        }
		    }).mouseup(function(){
		    	_move=false;
		    });
		    
		 });
	};
})(jQuery);