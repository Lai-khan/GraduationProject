const form = document.form;
const formId = form.nickname;
const formEmail = form.email;
const formPassword = form.password;
const formPasswordCheck = form.passwordCheck;

const processForm = (dest) => {
	if(checkID(formId.value) == false){ formId.focus(); return false; }
	if(checkEmail(formEmail.value) == false){ formEmail.focus(); return false; }
	if(checkPassword(formPassword.value) == false){ formPassword.focus(); return false; }
	
	if(formPasswordCheck.value.length == 0){
		alert("확인용 비밀번호를 입력하지 않으셨습니다.");
		formPasswordCheck.focus();
		return false;
	}

	if(formPassword.value != formPasswordCheck.value){
		alert("입력한 비밀번호가 서로 일치하지 않습니다.");
		formPassword.focus();
		return false;
	}

	var f = generateForm(formId.value, formEmail.value, formPassword.value);
	postForm(f, dest);
}