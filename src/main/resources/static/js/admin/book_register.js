window.onload = () => { // js 파일이 여러개인 경우 하나만 호출
  BookRegisterService.getInstance().loadCategories();

  ComponentEvent.getInstance().addClickEventRegisterButton();
  ComponentEvent.getInstance().addClickEventImgAddButton();
  ComponentEvent.getInstance().addChangeEventImgFile();
  ComponentEvent.getInstance().addClickEventImgRegisterButton();
  ComponentEvent.getInstance().addClickEventImgCancelButton();
}

const bookObj = {
  bookCode : "",
  bookName : "",
  author : "",
  publisher : "",
  publicationDate : "",
  category : ""
}

const fileObj = {
  files : new Array(),
  formData : new FormData()
}


class BookRegisterApi {
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookRegisterApi();
    }
    return this.#instance;
  }

  registerBook(){
    let successFlag = false;

    $.ajax({
      async : false,
      type : "post",
      url : "http://localhost:8000/api/admin/book",
      contentType : "application/json",
      data : JSON.stringify(bookObj),
      dataType : "json",
      success : response => {
        successFlag = true;
      },
      error : error =>{
        console.log(error);
        BookRegisterService.getInstance().setErrors(error.responseJSON.data);
        
      }

    });
    return successFlag;
    
  }

  registerImg(){

    $.ajax({
      async : false,
      type : "post", //multiparts는 무조건 post
      url : `http://localhost:8000/api/admin/book/${bookObj.bookCode}/images`,
      encType : "multipart/form-data", //formdata 통째로 날릴때 사용
      //데이터 날리는 방법 쿼리스트링//json//multipart/formData(json과 유사)
      contentType : false,
      processData : false, 
      //multipart/form-data 시에 encType, contentType, processData 는 세트
      data:fileObj.formData,
      dataType :"json",
      success : response =>{
        alert("도서 이미지가 등록 완료.")
        location.reload();
      },
      error:error =>{
        console.log(error);
      }

    });
    
  }

  getCategories () {
    let responseData = null;

    $.ajax({
      async : false,
      type : "get",
      url : "http://localhost:8000/api/admin/categories",
      dataType : "json",
      success: response =>{
        responseData = response.data;
      },  
      error : error =>{
        console.log(error);
      }

    });
    return responseData;
  }
}

class BookRegisterService {
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookRegisterService();
    }
    return this.#instance;
  }

  setBookObjValues(){
    const registerInputs =document.querySelectorAll(".register-input");

    bookObj.bookCode = registerInputs[0].value;
    bookObj.bookName = registerInputs[1].value;
    bookObj.author = registerInputs[2].value;
    bookObj.publisher = registerInputs[3].value;
    bookObj.publicationDate = registerInputs[4].value;
    bookObj.category = registerInputs[5].value;
  }
  loadCategories(){
    const responseData = BookRegisterApi.getInstance().getCategories();
    
    const categorySelect = document.querySelector(".category-select");
    categorySelect.innerHTML =`<option value="">분야를 선택하세요.</option>`;

    responseData.forEach(data => {
      categorySelect.innerHTML +=`
      <option value="${data.category}">${data.category}</option>
      `;
    });
  }

  setErrors(errors){ //필수작성인것들 체크.
    const errorMessages = document.querySelectorAll(".error-message");
    this.clearErrors();

    Object.keys(errors).forEach(key => { //원래는 (k,v)
      if(key == "bookCode"){
        errorMessages[0].innerHTML= errors[key];
      }else if(key=="bookName"){
        errorMessages[1].innerHTML= errors[key];
      }else if(key=="category"){
        errorMessages[5].innerHTML= errors[key];
      }

    })

  }
  clearErrors(){
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(error => {
      error.innerHTML ="";
    })
  }
}

class ImgFileService{
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new ImgFileService();
    }
    return this.#instance;
  }

  getImgPreview(){
    const bookImg = document.querySelector(".book-img");

    //1
    const reader = new FileReader();

    //3
    reader.onload =(e)=>{ 
      bookImg.src = e.target.result;
    }
    
    //2 e=reader.readAsDataURL(fileObj.files[0]), 이건 url임 위의 target = url을 들고옴
    reader.readAsDataURL(fileObj.files[0])

  }
}

class ComponentEvent {
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new ComponentEvent();
    }
    return this.#instance;
  }

  addClickEventRegisterButton() {
    const registerButton = document.querySelector(".register-button");

    registerButton.onclick = ()=>{

      BookRegisterService.getInstance().setBookObjValues();
      const successFlag = BookRegisterApi.getInstance().registerBook();
      // BookRegisterApi.getInstance().registerBook(); => true

      if(!successFlag) { //successFlag 가 true가 아니면 등록취소해라.
        return;
      }

      if(confirm("도서 이미지를 등록하시겠습니까?")){
        const imgAddButton = document.querySelector(".img-add-button");
        const imgCancelButton = document.querySelector(".img-cancel-button");

        imgAddButton.disabled = false;
        imgCancelButton.disabled = false;
      }else{
        location.reload(); //아예 새로고침, 기존작성해놓은거까지.
      }

    }
  }

  addClickEventImgAddButton() {
    const imgFile = document.querySelector(".img-file");
    const addButton = document.querySelector(".img-add-button");

    addButton.onclick = () => {
      imgFile.click();
    }
  }

 
  addChangeEventImgFile(){ /*파일 변경 시 뜨는 이미지 바꾸기*/
    const imgFile = document.querySelector(".img-file");
    
    imgFile.onchange = ()=>{
      const formData = new FormData(document.querySelector(".img-form"));
      let changeFlag = false;

      fileObj.files.pop();
      
      formData.forEach(value => {
        console.log(value); //이미지 확인용

        if(value.size != 0){ //등록클릭후 취소를 눌르면 size가 0 이므로 일어나지 않음
          fileObj.files.push(value);
          changeFlag = true; // 이미지가 바뀜. false를 잡는 이유는 false->true 가 됨으로써 실행이 일어났다 라는걸 확인하기 위함?
        }
      });

      if(changeFlag) { //추가버튼 클릭할때마다 데이터 비워줌.
      //if문 자체가 ()안이 참(true)일때 일어나니까 위에서 changeFlag를 true로 바꿔준다.
        
        const imgRegisterButton = document.querySelector(".img-register-button");
        imgRegisterButton.disabled = false;

        ImgFileService.getInstance().getImgPreview();

        imgFile.value =null;
      }
    }

  }

  addClickEventImgRegisterButton(){
    const imgRegisterButton = document.querySelector(".img-register-button");
    
    imgRegisterButton.onclick = ()=> {
      fileObj.formData.append("files", fileObj.files[0]) //formData = map 유사 , bookApi의 registerBookImg의 files와 매칭
      BookRegisterApi.getInstance().registerImg();
    }
  }

  addClickEventImgCancelButton(){
    const imgCancelButton = document.querySelector(".img-cancel-button");
    imgCancelButton.onclick = () => {
      if(confirm("정말로 이미지 등록을 취소하시겠습니까?")){
        location.reload();
      }
    }
  }

}