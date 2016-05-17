(function (login,password) {
	if ($("a[href='#pop-enter']").length>0) {
		$("a[href='#pop-enter']").click();
		$("#customer_session_email").val(login);
		$("#customer_session_password").val(password);
		$("#new_customer_session input[type='submit']").click();
		return "tryingtologin";
	} else {
		return "success";
	}
})