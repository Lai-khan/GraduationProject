const form = document.form;
const formId = form.nickname;
const formEmail = form.email;
const formPassword = form.password;

const processForm = (dest) => {
	if(checkID(formId.value) == false){ formId.focus(); return false; }
	if(checkEmail(formEmail.value) == false){ formEmail.focus(); return false; }
	if(checkPassword(formPassword.value) == false){ formPassword.focus(); return false; }
	
	var f = generateForm(formId.value, formEmail.value, formPassword.value);
	postForm(f, dest);
}