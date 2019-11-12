const form = document.form;
const formId = form.musicTitle;
const formFile = form.gpfile;

const processForm = (dest) => {
	if(checkID(formId.value) == false){ formId.focus(); return false; }
	
	if(formPassword.value == ""){
		alert("파일이 선택되지 않았습니다.");
		return false;
	}

	var f = generateFileForm(formId.value, formFile.value);
	postForm(f, dest);
}