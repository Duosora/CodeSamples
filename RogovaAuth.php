<?php
	/*
		curl -X POST \
			https://api.instagram.com/oauth/access_token \
			-F client_id={app-id} \
			-F client_secret={app-secret} \
			-F grant_type=authorization_code \
			-F redirect_uri={redirect-uri} \
			-F code={code}
	*/
	
	$code = $_GET['code']; // instagram authorization code
	
	echo $code;