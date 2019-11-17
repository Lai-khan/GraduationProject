function check() {
    var result = confirm("정말로 삭제하시겠습니까?");
    console.log(result);
    if(result == true){
        create.submit();
    }
    else if(result == false){
        return false;
    }
}