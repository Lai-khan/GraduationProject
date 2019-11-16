const form = document.form;
const formId = form.musicTitle;
const formFile = form.gpfile;

const processForm = (dest) => {
	if(formId.value == ""){
		alert("제목을 입력해 주세요.");
		formId.focus();
		return false;
	}
	
	if(formFile.files.length == 0){
		alert("파일을 선택해 주세요.");
		return false;
	}

	var f = generateFileForm(formId.value, formFile);
	//return false;
	postForm(f, dest);
}