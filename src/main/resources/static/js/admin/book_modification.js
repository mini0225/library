window.onload = () => { // js 파일이 여러개인 경우 하나만 호출
  BookModificationService.getInstance().setBookCode();
  
  BookModificationService.getInstance().loadCategories();
  BookModificationService.getInstance().loadBookAndImageData();

  ComponentEvent.getInstance().addClickEventModificationButton();
  ComponentEvent.getInstance().addClickEventImgAddButton();
  ComponentEvent.getInstance().addChangeEventImgFile();
  ComponentEvent.getInstance().addClickEventImgModificationButton();
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

const imgObj={
  imageId : null,
  bookCode : null,
  saveName : null,
  originName : null
}

const fileObj = {
  files : new Array(),
  formData : new FormData()
}


class BookModificationApi {
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookModificationApi();
    }
    return this.#instance;
  }

  

  getBookAndImage(){
    let responseData = null;

    $.ajax({
      async : false,
      type : "get",
      url : `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}`, //아래의 setBookCode에서 bookObj.bookCode 설정됨.
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

  getCategories () {
    let responseData = null;

    $.ajax({
      async : false,
      type : "get",
      url : "http://127.0.0.1:8000/api/admin/categories",
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

  modifyBook(){
    let successFlag = false;

    $.ajax({
      async:false,
      type : "put",
      url : `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}`,
      contentType : "application/json",
      data : JSON.stringify(bookObj),
      dataType : "json",
      success : response =>{
        successFlag = true;
      },
      error: error=>{
        console.log(error);
        BookModificationService.getInstance().setErrors(error.responseJSON.data);
      }
    });

    return successFlag;

  }

  removeImg(){
    let successFlag = false;

    $.ajax({
      async:false,
      type: "delete",
      url : `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}/image/${imgObj.imageId}`,
      dataType : "json",
      success : response =>{
        successFlag = true;
      },
      error:error =>{
        console.log(error);
      }
    });
    
    return successFlag;
  }

  registerImg(){
    $.ajax({
      async : false,
      type : "post", //multiparts는 무조건 post
      url : `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}/images`,
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
}

class BookModificationService {
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookModificationService();
    }
    return this.#instance;
  }

  setBookCode(){
    console.log(location.search);
    const URLSearch = new URLSearchParams(location.search);
    console.log(URLSearch.get("bookCode"));

    bookObj.bookCode = URLSearch.get("bookCode");
  }

  setBookObjValues(){
    const modificationInputs =document.querySelectorAll(".modification-input");

    bookObj.bookCode = modificationInputs[0].value;
    bookObj.bookName = modificationInputs[1].value;
    bookObj.author = modificationInputs[2].value;
    bookObj.publisher = modificationInputs[3].value;
    bookObj.publicationDate = modificationInputs[4].value;
    bookObj.category = modificationInputs[5].value;
  }

  loadBookAndImageData(){
    
    const responseData = BookModificationApi.getInstance().getBookAndImage();

    if(responseData.bookMst == null){
      alert("해당 도서코드는 등록이 되지 않은 코드 입니다.")
      history.back();
      return;
    }

    const modificationInputs = document.querySelectorAll(".modification-input");

    modificationInputs[0].value = responseData.bookMst.bookCode;
    modificationInputs[1].value = responseData.bookMst.bookName;
    modificationInputs[2].value = responseData.bookMst.author;
    modificationInputs[3].value = responseData.bookMst.publisher;
    modificationInputs[4].value = responseData.bookMst.publicationDate;
    modificationInputs[5].value = responseData.bookMst.category;

    if(responseData.bookImage !=null){
      imgObj.imageId= responseData.bookImage.imageId;
      imgObj.bookCode= responseData.bookImage.bookCode;
      imgObj.saveName = responseData.bookImage.saveName;
      imgObj.originName = responseData.bookImage.originName;
      
      const bookImg = document.querySelector(".book-img");
      bookImg.src = `http://127.0.0.1:8000/image/book/${responseData.bookImage.saveName}`
    }

  }

  loadCategories(){
    const responseData = BookModificationApi.getInstance().getCategories();
    
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

  addClickEventModificationButton() {
    const modificationButton = document.querySelector(".modification-button");

    modificationButton.onclick = ()=>{

      BookModificationService.getInstance().setBookObjValues();
      const successFlag = BookModificationApi.getInstance().modifyBook();
      // BookModificationApi.getInstance().modifyBook(); => true

      if(!successFlag) { //successFlag 가 true가 아니면 등록취소해라.
        return;
      }

      BookModificationService.getInstance().clearErrors();

      if(confirm("도서 이미지를 수정하시겠습니까?")){
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
        
        const imgModificationButton = document.querySelector(".img-modification-button");
        imgModificationButton.disabled = false;

        ImgFileService.getInstance().getImgPreview();

        imgFile.value =null;
      }
    }

  }

  addClickEventImgModificationButton(){
    const imgModificationButton = document.querySelector(".img-modification-button");
    
    imgModificationButton.onclick = ()=> {
      fileObj.formData.append("files", fileObj.files[0]) //formData = map 유사 , bookApi의 modificationBookImg의 files와 매칭
      
      let successFlag = true;

      if(imgObj.imageId !=null){ //null이 아니면 이미지가 있다는 얘기라서 삭제 필요
        successFlag = BookModificationApi.getInstance().removeImg();
      }

      if(successFlag){
        BookModificationApi.getInstance().registerImg();
      }
    }
  }

  addClickEventImgCancelButton(){
    const imgCancelButton = document.querySelector(".img-cancel-button");
    imgCancelButton.onclick = () => {
      if(confirm("정말로 이미지 수정을 취소하시겠습니까?")){
        location.reload();
      }
    }
  }

}