var _pagination_='<div class="c-pages clearfix">' +
       		'<div class="c-pages-wraaper textR fr">' +
       		'	<div class="c-pages-left fl mr5">' +
       		'   <% if (showPreBtn) { %>      ' +
            '       <a href="javascript:;" id="<%=preBtn%>" class="pre">上一页</a>' +
             '  <% } %>      ' +
	        '     <% if (firstPage) { %>      ' +
       		'	    <a href="javascript:;"  flag="page"	 >1</a>' +
       		'      <% } %>      ' +
       		'          <% if (front) { %>      ' +
       		'             <span>...</span> ' +
       		'          <% } %>      ' +
       		'    <% for (var i = 0; i < u.length; i ++) { %> ' +
          	'	    <a href="javascript:;"  flag="page"	 ><%=u[i]%></a>' +
           '     <% } %> ' +
       		'	<a href="javascript:;" flag="page" class="current"><%=currentPageNumber%></a> ' +
       		'   <% for (var i = 0; i < d.length; i ++) { %> ' +
            '		<a href="javascript:;"  flag="page"	 ><%=d[i]%></a>' +
            '   <% } %> ' +
       	   '    <% if (last) { %>      ' +
               		'             <span>...</span> ' +
           '    <% } %>      ' +
            '     <% if (lastPage) { %>      ' +
                  		'	    <a href="javascript:;"  flag="page"	 ><%=totalPageNumber%></a>' +
                  		'      <% } %>      ' +
           '   <% if (showLasBtn) { %>      ' +
	        '		<a href="javascript:;"  id="<%=lasBtn%>"	class="next">下一页</a>' +
            '  <% } %>      ' +
       		'	</div>' +
       		'	<div class="c-pages-right fl">' +
       		'		<span>共<%=count%>条记录</span> <span>到第</span>' +
       		'		<input type="text" value="<%=currentPageNumber%>"  id="<%=currentPage%>" maxlength="5" class="textC text"><span>页</span>' +
       		'		 <a   id="<%=jumpPage%>"	href="javascript:;" class="btnC btnC-L"><span>跳转</span></a>' +
       		'	</div>' +
       		'</div>' +
       	'</div>';