const form = document.form;
const formId = form.loginID;
const formPassword = form.password;

const processForm = (dest) => {
	if(checkIDandEmail(formId.value) == false){ formId.focus(); return false; }

	for(let i in formPassword.value){
		if(isPasswordCharValid(formPassword.value.charAt(i)) == false){
			alert("비밀번호에 유효하지 않은 문자가 있습니다.");
			formPassword.focus();
			return false;
		}
	}

	if(isFilled(formPassword.value) == false){
		alert("비밀번호를 입력해 주시기 바랍니다.");
		formPassword.focus();
		return false;
	}
	//if(checkPassword(formPassword.value) == false){ formPassword.focus(); return false; }
	
	var f = generateForm(formId.value, formId.value, formPassword.value);
	postForm(f, dest);
}