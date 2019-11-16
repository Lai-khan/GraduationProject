// 1. whether id is entered and over 4 character
// 2. whether pw is entered and over 6 character
// 3. special character checking
// 4. 

// variables
// variables you need to check
const MODE_DEBUG = false;
const MODE_ALERT = true;
const idLength = 2;
const pwLength = 8;

const MSG_NICKNAME_EMPTY = "닉네임이 비어있습니다.";
const MSG_NICKNAME_SHORT = "닉네임 길이가 " + idLength + "자 이상인지 확인해주세요.";
const MSG_NICKNAME_FORMAT = "닉네임의 특수 문자를 확인해주세요. 특수 문자는 -, _만이 가능합니다.";
const MSG_EMAIL_EMPTY = "이메일이 비어있습니다.";
const MSG_EMAIL_FORMAT = "이메일 형식이 맞는지 확인해주세요.";
const MSG_PASSWORD_EMPTY = "비밀번호가 비어있습니다.";
const MSG_PASSWORD_SHORT = "비밀번호 길이가 " + pwLength + "자 이상인지 확인해주세요.";
const MSG_PASSWORD_FORMAT = "비밀번호의 특수 문자를 확인해주세요. 특수 문자는 @, #, %, ^, &, ., !만이 가능합니다.";
const MSG_PASSWORD_ALPHABET = "비밀번호는 영문자와 숫자를 전부 포함하고 있어야 합니다.";
const MSG_STRING_EMPTY = "닉네임/이메일이 비어있습니다.";
const MSG_STRING_FORMAT = "닉네임/이메일의 형식이 맞지 않습니다.";
const MSG_FILE_EMPTY = "파일을 선택하지 않았습니다.";
const SCSET_NICKNAME = ['_', '-'];
const SCSET_EMAIL = ['@', '.'];
const SCSET_PASSWORD = ['@', '#', '%', '^', '&', '.', '!'];

// function::log
// - logs [message] if MODE_DEBUG is on
const log = (message) => {
	if(MODE_DEBUG) console.log(message);
}

// function::toast
// - alerts [message] if MODE_ALERT is on
const toast = (message) => {
	if(MODE_ALERT) alert(message);
}

// function::isFilled
// - returns whether [s] is NOT empty
const isFilled = (s) => {
	if(s.length == 0) return false;
	//if(s.value == "") return false;
	else return true;
}

// function::isValid
// - returns whether is [s] is longer or equal than [len]
const isValid = (s, len) => {
	if(s.length >= len) return true;
	else return false;
}

const isCharInSet = (set, c) => {
	for(let i in set){
		if(set[i] == c) return true;
	}
	return false;
}

// function::isSpecialCharValid
// - returns whether the special character [c] is permitted one
const isSpecialCharValid = (c) => {
	if(
		isCharInSet(SCSET_NICKNAME, c) ||
		isCharInSet(SCSET_EMAIL, c) ||
		isCharInSet(SCSET_PASSWORD, c)
	) return true;
	else return false;
}

const isCharAlphabetical = (c) => {
	if(
		('A'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= 'Z'.charCodeAt()) ||
		('a'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= 'z'.charCodeAt())
	) return true;
	else return false;
}

const isCharNumerical = (c) => {
	if(
		('0'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= '9'.charCodeAt())
	)return true;
	else return false;
}

// function::isNormalCharValid
// - returns whether the character [c] is alphabetical, or numerical character
const isNormalCharValid = (c) => {
	if(
		isCharAlphabetical(c) ||
		isCharNumerical(c)
	) return true;
	else return false;
}


const isIdCharValid = (c) => {
	if(
		isNormalCharValid(c) ||
		isCharInSet(SCSET_NICKNAME, c)
	) return true;
	else return false;
}

const isEmailCharValid = (c) => {
	if(
		isNormalCharValid(c) ||
		isCharInSet(SCSET_EMAIL, c)
	) return true;
	else return false;
}

const isPasswordCharValid = (c) => {
	if(
		isNormalCharValid(c) ||
		isCharInSet(SCSET_PASSWORD, c)
	) return true;
	else return false;
}

// function::isCharValid
// - returns whether the character [c] is permitted character
const isCharValid = (c) => {
	if(
		isNormalCharValid(c) || 
		isSpecialCharValid(c)
	) return true;
	else return false;
}

// function::isCharAtChar
// - returns whether the character [c] is [@] character
const isCharAtChar = (c) => {
	if(c == '@') return true;
	else return false;
}

// function::isCharDotChar
// - returns whether the character [c] is [.] character
const isCharDotChar = (c) => {
	if(c == '.') return true;
	else return false;
}

// function::checkString
// - TOTAL CHECKING FUNCTION ON STRING
// - combination of the following functions
//		- function::isFilled
//		- function::isValid
//		- function::isCharValid
//			- function::isSpecialCharValid
//			- function::isNormalCharValid
const checkString = (s, len) => {
	// form has not been filled
	if(isFilled(s) == false){
		toast("string is empty");
		log("string is empty");
		return false;
	}			

	// string length is not enough
	if(isValid(s, len) == false){
		toast("string is too short");
		log("string is too short");
		return false;
	}

	for(let i in s){
		if(isCharValid(s.charAt(i)) == false){
			// character is not valid
			toast("character is wrong at place: " + i);
			log("character is wrong at place: " + i);
			return false;
		}
	}
	return true;
}

// function::checkID
// - TOTAL CHECKING FUNCTION ON ID STRING
const checkID = (id) => {
		// form has not been filled
		if(isFilled(id) == false){
			toast(MSG_NICKNAME_EMPTY);
			log("nickname is empty");
			return false;
		}			
	
		// string length is not enough
		if(isValid(id, idLength) == false){
			toast(MSG_NICKNAME_SHORT);
			log("nickname is too short");
			return false;
		}
	
		for(let i in id){
			if(isIdCharValid(id.charAt(i)) == false){
				// character is not valid
				toast(MSG_NICKNAME_FORMAT);
				log("character is wrong at place: " + i);
				return false;
			}
		}
		return true;
}

// function::checkPassword
// - TOTAL CHECKING FUNCTION ON PASSWORD STRING
const checkPassword = (pw) => {
	// form has not been filled
	if(isFilled(pw) == false){
		toast(MSG_PASSWORD_EMPTY);
		log("password is empty");
		return false;
	}			

	// string length is not enough
	if(isValid(pw, pwLength) == false){
		toast(MSG_PASSWORD_SHORT);
		log("password is too short");
		return false;
	}

	let state = 0b00;

	for(let i in pw){
		if(isPasswordCharValid(pw.charAt(i)) == false){
			// character is not valid
			toast(MSG_PASSWORD_FORMAT);
			log("character is wrong at place: " + i);
			return false;
		}
		if(isCharNumerical(pw.charAt(i))){
			state |= 0b01;
		}
		if(isCharAlphabetical(pw.charAt(i))){
			state |= 0b10;
		}
	}

	if(state != 0b11){
		toast(MSG_PASSWORD_ALPHABET);
		log("pw is not having both alphabet and numeric characters.");
		return false;
	}

	return true;
}

// function::checkEmail
// - TOTAL CHECKING FUNCTION ON PASSWORD STRING
const checkEmail = (e) => {
	// form checking
	if(isFilled(e) == false){
		toast(MSG_EMAIL_EMPTY);
		log("email form is empty");
		return false;
	}

	// character checking
	let state = 0;
	let lastChar = '';
	// state
	// 00000000 . 00000 @ 1111 . 22 . 22
	// d.j@server1.proseware.com is well as ok

	for(let i in e){
		if(i != 0){
			// comparision with last character
			if(e.charAt(i) == lastChar && (isCharDotChar(lastChar) || isCharAtChar(lastChar))){
				// checking: @@ and ..
				toast(MSG_EMAIL_FORMAT);
				log("email syntax is wrong at place(../@@ detected): " + i);
				return false;
			}
			if(isCharAtChar(e.charAt(i)) && isCharDotChar(lastChar)){
				// checking: .@
				toast(MSG_EMAIL_FORMAT);
				log("email syntax is wrong at place(.@ detected): " + i);
				return false;
			}
			if((isNormalCharValid(lastChar) == false) && isCharAtChar(e.charAt(i))){
				// checking: [special char]@
				toast(MSG_EMAIL_FORMAT);
				log("email syntax is wrong at place(?@ detected): " + i);
				return false;
			}
			if(isCharAtChar(e.charAt(i)) && (isNormalCharValid(lastChar) == false)){
				// checking: @[special char]
				toast(MSG_EMAIL_FORMAT);
				log("email syntax is wrong at place(@? detected): " + i);
				return false;
			}
		}

		// new last char
		lastChar = e.charAt(i);

		// wrong character
		if(isCharValid(lastChar) == false){
			toast(MSG_EMAIL_FORMAT);
			log("email character is wrong at place: " + i);
			return false;
		}

		// if @
		if(isCharAtChar(lastChar)){
			// state 0 -> 1
			if(state == 0){
				state = 1;
			}else{
				toast(MSG_EMAIL_FORMAT);
				log("email structure syntax is wrong at place: " + i);
				log("email state code: " + state);
				return false;
			}

		// if .
		}else if(isCharDotChar(lastChar)){
			// state 1 -> 2
			// state 2 -> 2
			if(state == 1 || state == 2){
				state = 2;
			}else if(state == 0){
				state = 0;
			}else{
				toast(MSG_EMAIL_FORMAT);
				log("email structure syntax is wrong at place: " + i);
				log("email state code: " + state);
			}
		}

	}

	if(state == 2 && isNormalCharValid(lastChar)){
		// email success
		return true;
	}else{
		// email failed
		toast(MSG_EMAIL_FORMAT);
		log("email state code is not enough.: " + state);
		return false;
	}
}


// function::checkIDandEmail
// - TOTAL CHECKING FUNCTION ON ID STRING
const checkIDandEmail = (s) => {
	// form has not been filled
	if(isFilled(s) == false){
		toast(MSG_STRING_EMPTY);
		log("nickname is empty");
		return false;
	}			

	var status = 0B00;

	for(let i in s){
		if(isEmailCharValid(s.charAt(i)) == false && isIdCharValid(s.charAt(i)) == false){
			// character is not valid
			toast(MSG_STRING_FORMAT);
			log("character is wrong at place: " + i);
			return false;
		}
		if(isEmailCharValid(s.charAt(i)) && (isNormalCharValid(s.charAt(i)) == false)){
			if((status & 0B01) > 0){
				// character is not valid
				toast(MSG_STRING_FORMAT);
				log("character is wrong at place: " + i);
				return false;
			}
			status = 0B10;
		}
		if(isIdCharValid(s.charAt(i)) && (isNormalCharValid(s.charAt(i)) == false)){
			if((status & 0B10) > 0){
				// character is not valid
				toast(MSG_STRING_FORMAT);
				log("character is wrong at place: " + i);
				return false;
			}
			status = 0B01;
		}
	}
	return true;
}

//===================================================
// form producing and post function
//===================================================

const generateForm = (id, email, password) => {
	let newForm = document.createElement("form");
	newForm.style.setProperty("display", "none");
	newForm.setAttribute("charset", "UTF-8");
	newForm.setAttribute("method", "Post");

	let hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "text");
	hiddenInput.setAttribute("name", "nickname");
	hiddenInput.setAttribute("value", id);
	newForm.appendChild(hiddenInput);

	hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "text");
	hiddenInput.setAttribute("name", "email");
	hiddenInput.setAttribute("value", email);
	newForm.appendChild(hiddenInput);

	hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "password");
	hiddenInput.setAttribute("name", "password");
	hiddenInput.setAttribute("value", password);
	newForm.appendChild(hiddenInput);

	return newForm;
}

const generateFileForm = (title, file) => {
	let newForm = document.createElement("form");
	newForm.style.setProperty("display", "none");
	//newForm.setAttribute("charset", "UTF-8");
	newForm.setAttribute("method", "Post");
	newForm.setAttribute("enctype", "multipart/form-data");

	let hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "text");
	hiddenInput.setAttribute("name", "musicTitle");
	hiddenInput.setAttribute("value", title);
	newForm.appendChild(hiddenInput);

	// guck farret
	//hiddenInput = document.createElement("input");
	//hiddenInput.setAttribute("type", "file");
	//hiddenInput.setAttribute("name", "gpfile");
	//hiddenInput.setAttribute("files", file);
	newForm.appendChild(file);

	return newForm;
}

const postForm = (form, destination) => {
	form.setAttribute("action", destination);

	document.body.appendChild(form);
	form.submit();
}

//===================================================
// main function - example
//===================================================
/*
const form = document.form;
const formId = form.input1;
const formEmail = form.input2;
const formPassword = form.input3;

const processForm = () => {
	if(checkID(formId.value) == false){ formId.focus(); return; }
	if(checkEmail(formEmail.value) == false){ formEmail.focus(); return; }
	if(checkPassword(formPassword.value) == false){ formPassword.focus(); return; }

	var f = generateForm(formId.value, formEmail.value, formPassword.value);
	postForm(f, "./index.html");
}

function submit_onclick(){
	processForm();
}
*/


/*const processForm = (dest) => {
	if(checkID(formId.value) == false){ formId.focus(); return false; }
	else{
		if(checkEmail(formEmail.value) == false){ formEmail.focus(); return false; }
		else{
			if(checkPassword(formPassword.value) == false){ formPassword.focus(); return false; }
			else{
				var f = generateForm(formId.value, formEmail.value, formPassword.value);
				postForm(f, dest);
			}
		}
	}
}*/
