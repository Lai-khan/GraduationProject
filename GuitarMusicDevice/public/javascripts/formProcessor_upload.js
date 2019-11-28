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

	var namelist = formFile.files[0].name.split('.');
	const allowset = ["gpx", "gp5", "gp4", "gp3"];
	var flag = false;
	for(let i in allowset){
	   if(namelist[namelist.length - 1] == allowset[i]) flag = true;
	}
	if(flag == false){
	   alert("잘못된 형식의 파일입니다.");
	   return false;
	} 

	var f = generateFileForm(formId.value, formFile);
	//return false;
	postForm(f, dest);
}