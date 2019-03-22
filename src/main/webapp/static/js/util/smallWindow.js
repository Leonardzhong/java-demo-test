;(function ($, window, document, undefined) {
  // Create the defaults once
  var pluginName = 'smallWindow',
    defaults = {
		  height:25,
		  closeCallBack:function(id){
			  
		  }
    };

  // The actual plugin constructor
	function SmallWindow(element, options) {
		this.element = $(element);
		//alert("aaaaaaa  "+options.height);
		defaults = $.extend({}, defaults, options);
		//alert("ddddddd  "+defaults.height);
		//this.init();
		//this.initAction();
		
		return this;
	}

	function triggerChangeEvent(dualListbox) {
		
	}

  SmallWindow.prototype = {
    addWindow: function (id,text) {
      var closeButton =$('<button class="close">×</button>');
      closeButton.click(function(){
    	  var id=$(this).parent().parent().attr('id');
    	  defaults.closeCallBack(id);
    	  $(this).parent().parent().remove();
    	  
      });
      var textObj=$('<span>'+text+'</span>');
      textObj.append(closeButton);
      this.container = $(
        '<div id="'+id+'" text="'+text+'" style="height:'+defaults.height+'px;margin:0px;float:left;padding-top:3px;" class="modal-content modal-header">' +
        
        '</div>'
        )
        .append(textObj).appendTo(this.element);
      //triggerChangeEvent("test");
      return id;
	 },
     initAction: function() {
    	 $(".modal-header .close").click(function () {
 			var chartPanel=$(this).parent().parent();
 			chartPanel.empty();
 			chartPanel.remove();
		});
     },
	 isExistSmallWindow:function(id){
		 var flag=false;
		 $(this.element).children().each(function(){
			 if($(this)[0].id==id){
				 flag=true;
				
			 }
		 });
		 return flag;
	 },
	 closeById:function(id){
		 if($("#"+this.element[0].id+" div[id="+id+"]").length>0){
			 $("#"+this.element[0].id+" div[id="+id+"]").remove();
		 }
	 },
	 closeAll:function(){
		 $("#"+this.element[0].id+"  div").remove();
	 },
	 getAllId:function(){
		 var arr=new Array();
		 if($("#"+this.element[0].id+" div").length>0){
			 $("#"+this.element[0].id+" div").each(function () {
				 arr.push($(this)[0].id);
			 });
		 }
		 return arr;
	 },
	 getAllText:function(){
		 var arr=new Array();
		 if($("#"+this.element[0].id+" div").length>0){
			 $("#"+this.element[0].id+" div").each(function () {
				 arr.push($(this).attr('text'));
			 });
		 }
		 return arr;
	 }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function (options) {
    var args = arguments;

    // Is the first parameter an object (options), or was omitted, instantiate a new instance of the plugin.
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          // Only allow the plugin to be instantiated once so we check that the element has no plugin instantiation yet

          // if it has no instance, create a new one, pass options to our plugin constructor,
          // and store the plugin instance in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new SmallWindow(this, options));
        }
      });
      // If the first parameter is a string and it doesn't start with an underscore or "contains" the `init`-function,
      // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      // Cache the method call to make it possible to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        // Tests that there's already a plugin-instance and checks that the requested public method exists
        if (instance instanceof SmallWindow && typeof instance[options] === 'function') {
          // Call the method of our plugin instance, and pass it the supplied arguments.
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
      });

      // If the earlier cached method gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }

  };

})(jQuery, window, document);
