const form = document.form;
const formId = form.loginID;
const formPassword = form.password;

const processForm = (dest) => {
	if(checkIDandEmail(formId.value) == false){ formId.focus(); return false; }
	if(checkPassword(formPassword.value) == false){ formPassword.focus(); return false; }
	
	var f = generateForm(formId.value, formId.value, formPassword.value);
	postForm(f, dest);
}