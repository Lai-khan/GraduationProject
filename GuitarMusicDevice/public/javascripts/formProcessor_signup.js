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
		toast("비밀번호 확인란을 입력해주세요.");
		log("pwCheck input empty");
		formPasswordCheck.focus();
		return false;
	}

	if(formPassword.value != formPasswordCheck.value){
		toast("비밀번호가 일치하지 않습니다.");
		log("pwCheck incorrection");
		formPassword.focus();
		return false;
	}

	var f = generateForm(formId.value, formEmail.value, formPassword.value);
	postForm(f, dest);
}