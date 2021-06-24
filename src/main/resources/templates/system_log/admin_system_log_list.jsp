<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../include_admin_taglib.html"%>
<!DOCTYPE HTML>
<html class="no-js">
  <head>
    <title>Backend System Log Management Page</title>
    <meta name="description" content="这是后台管理系统日志管理页面">
    <meta name="keywords" content="systsemLogManagement">
    <%@ include file="../include_admin_head.html"%>
  </head>
  <body>
    <tags:subtitle primary="系统日志" secondary="列表" hr="true" />
    <div class="am-g error-log">
        <div class="am-u-sm-12 am-u-sm-centered">
        <pre class="am-pre-scrollable" id="log_container">
        </pre>
        </div>
      </div>
    <%@ include file="../include_list_required.html"%>
    
    <script>
    $(document).ready(function() {
    	var url = projectPath + '/systemLog'; 
    	var websocket = new SockJS(url, undefined, {transports: []});
    	websocket.onopen = function() {console.log('日志系统连接开启...')};
    	websocket.onmessage = function(e) {
    		// 接收服务端的实时日志并添加到HTML页面中
    		$('#log_container').append('<span class="am-text-success">' + event.data.toLocaleString() + '</span><br>');
    	};
    	websocket.onclose = function() {console.log('日志系统连接终止!')};
    	websocket.onheartbeat = function() {console.log('日志系统保持连接...')};	
    });
	</script>
	
	<script src="${pageContext.request.contextPath }/static/WEBSOCKET/js/sockjs-1.1.2.min.js"></script>
  </body>
</html>