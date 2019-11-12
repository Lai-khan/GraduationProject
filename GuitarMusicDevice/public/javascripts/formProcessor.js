// 1. whether id is entered and over 4 character
// 2. whether pw is entered and over 6 character
// 3. special character checking
// 4. 

// variables
// variables you need to check
const MODE_DEBUG = false;
const MODE_ALERT = true;
const idLength = 4;
const pwLength = 6;

const MSG_NICKNAME_EMPTY = "닉네임이 비어있습니다.";
const MSG_NICKNAME_SHORT = "닉네임 길이가 " + idLength + "자 이상인지 확인해주세요.";
const MSG_NICKNAME_FORMAT = "닉네임의 특수 문자를 확인해주세요. 특수 문자는 @, -, _, .만이 가능합니다.";
const MSG_EMAIL_EMPTY = "이메일이 비어있습니다.";
const MSG_EMAIL_FORMAT = "이메일 형식이 맞는지 확인해주세요.";
const MSG_PASSWORD_EMPTY = "비밀번호가 비어있습니다.";
const MSG_PASSWORD_SHORT = "비밀번호 길이가 " + pwLength + "자 이상인지 확인해주세요.";
const MSG_PASSWORD_FORMAT = "비밀번호의 특수 문자를 확인해주세요. 특수 문자는 @, -, _, .만이 가능합니다.";
const MSG_FILE_EMPTY = "파일을 선택하지 않았습니다.";

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
	if(s.value == "") return false;
	else return true;
}

// function::isValid
// - returns whether is [s] is longer or equal than [len]
const isValid = (s, len) => {
	if(s.length >= len) return true;
	else return false;
}

// function::isSpecialCharValid
// - returns whether the special character [c] is permitted one
const isSpecialCharValid = (c) => {
	if(
		c == '@' ||
		c == '-' ||
		c == '_' ||
		c == '.'
	) return true;
	else return false;
}

// function::isNormalCharValid
// - returns whether the character [c] is alphabetical, or numerical character
const isNormalCharValid = (c) => {
	if(
		('A'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= 'Z'.charCodeAt()) ||
		('a'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= 'z'.charCodeAt()) ||
		('0'.charCodeAt() <= c.charCodeAt() && c.charCodeAt() <= '9'.charCodeAt())
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
	// form checking

	// form has not been filled
	if(isFilled(s) == false){
		if(len == idLength) toast(MSG_NICKNAME_EMPTY);
		if(len == pwLength) toast(MSG_PASSWORD_EMPTY);
		log("string is empty");
		return false;
	}			

	// string length is not enough
	if(isValid(s, len) == false){
		if(len == idLength) toast(MSG_NICKNAME_SHORT);
		if(len == pwLength) toast(MSG_PASSWORD_SHORT);
		log("string is too short");
		return false;
	}

	for(let i in s){
		if(isCharValid(s.charAt(i)) == false){
			// character is not valid
			if(len == idLength) toast(MSG_NICKNAME_SHORT);
			if(len == pwLength) toast(MSG_PASSWORD_SHORT);
			log("character is wrong at place: " + i);
			return false;
		}
	}
	return true;
}

// function::checkID
// - TOTAL CHECKING FUNCTION ON ID STRING
const checkID = (id) => { return checkString(id, idLength); }

// function::checkPassword
// - TOTAL CHECKING FUNCTION ON PASSWORD STRING
const checkPassword = (pw) => { return checkString(pw, pwLength); }

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

//===================================================
// form producing and post function
//===================================================

const generateForm = (id, email, password) => {
	let newForm = document.createElement("form");
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
	newForm.setAttribute("charset", "UTF-8");
	newForm.setAttribute("method", "Post");
	newForm.setAttribute("enctype", "multipart/form-data");

	let hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "text");
	hiddenInput.setAttribute("name", "musicTitle");
	hiddenInput.setAttribute("value", title);
	newForm.appendChild(hiddenInput);

	hiddenInput = document.createElement("input");
	hiddenInput.setAttribute("type", "file");
	hiddenInput.setAttribute("name", "gpfile");
	hiddenInput.setAttribute("value", file);
	newForm.appendChild(hiddenInput);

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
