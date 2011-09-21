<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="org.wescheme.user.SessionManager" %>
<%@ page import="org.wescheme.user.Session" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head><title>WeScheme</title>


  <!-- Google Chrome Frame installation -->
  <script type="text/javascript" 
          src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>

  <style>
    /* 
    CSS rules to use for styling the overlay:
    .chromeFrameOverlayContent
    .chromeFrameOverlayContent iframe
    .chromeFrameOverlayCloseBar
    .chromeFrameOverlayUnderlay
    */
  </style> 

  <script>
    // You may want to place these lines inside an onload handler
    CFInstall.check({
    mode: "overlay",
    destination: "http://www.wescheme.org"
    });
  </script>



<!-- Google analytics support -->
<jsp:include page="/google-analytics.jsp"/>


<!-- Add compatibility libraries for IE. -->
<jsp:include page="/js/compat/compat.jsp"/>

<script src="/editor/jquery.js"></script>

<link rel="stylesheet" type="text/css" href="css/splash.css" id="style" />

</head>
<body>
<h1>WeScheme</h1>
<input id="newProgram" value="Start Coding" type="button" onclick="javascript:window.location='/openEditor'" />
	<img src="css/images/BigLogo.png">
	

<%
		// Are we logged in?
		SessionManager sm = new SessionManager();
		Session s = sm.authenticate(request, response);
		UserService us = UserServiceFactory.getUserService();
		if( s == null ) {
%>

 <input id="newProgram" value="Log In" type="button" onclick="javascript:window.location='<%= us.createLoginURL("/login.jsp") %>'" />
 
<%  } else { %>

<input id="newProgram" value="Log Out" type="button" onclick="javascript:window.location='/logout'" %>

<% } %>	
	
	
<h2>Sometimes YouTube. Perhaps iPhone. Together, WeScheme!</h2>


<div id="links">
     <a href="http://www.vidiowiki.com/watch/cydr9yk/#">What is WeScheme? [video]</a>
</div>



<jsp:include page="/footer.jsp"/>
</body></html>
