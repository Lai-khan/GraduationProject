const form = document.form;
const formId = form.musicTitle;
const formFile = form.gpfile;

const processForm = (dest) => {
	if(formId.value == ""){
		alert("제목이 입력되지 않았습니다.");
		formId.focus();
		return false;
	}
	
	if(formFile.files.length == 0){
		alert("파일이 선택되지 않았습니다.");
		return false;
	}

	var f = generateFileForm(formId.value, formFile);
	//return false;
	postForm(f, dest);
}