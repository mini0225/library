window.onload = () => {
  ComponentEvent.getInstance().addClickEventRegisterButton();
  ComponentEvent.getInstance().addClickEventImgAddButton();
  ComponentEvent.getInstance().addChangeEventImgFile();
}

const fileObj = {
  files : new Array()

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
      if(confirm("도서 이미지를 등록하시겠습니까?")){
        const imgAddButton = document.querySelector(".img-add-button");
        const imgRegisterButton = document.querySelector(".img-register-button");

        imgAddButton.disabled = false;
        imgRegisterButton.disabled = false;
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
        
        ImgFileService.getInstance().getImgPreview();

        imgFile.value =null;
      }
    }

  }

}