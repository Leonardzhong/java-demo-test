/**
 * @author zhangzhiguo
 * @date 2016年4月15日
 */

(function ($) {
    $.fn.extend({
        val2:function(){
            if ($(this).val() == $(this).attr("tips")) {
                return "";
            }else{
                return   $(this).val();
            }
        },
        placeholder: function () {
            if (!isPlaceholer()) {
                $(this).val($(this).attr("tips"));
                $(this).focus(function () {
                    if ($(this).val() == $(this).attr("tips")) {
                        $(this).val("")
                    }
                })
                $(this).blur(function () {
                    if ($(this).val() == "") {
                        $(this).val($(this).attr("tips"));
                    }
                })


            }else{
                $(this).attr("placeholder",$(this).attr("tips"));
            }
        }

    })
    //判断是否支持placeholder
    function isPlaceholer() {
        var input = document.createElement('input');
        return "placeholder" in input;
    }

})(jQuery);

