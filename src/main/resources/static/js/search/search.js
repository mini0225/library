window.onload = () => {
  HeaderService.getInstance().loadHeader();

  SearchService.getInstance().clearBookList();
  SearchService.getInstance().loadSearchBooks();

  SearchService.getInstance().loadCategories();
  SearchService.getInstance().setMaxPage();

  ComponentEvent.getInstance().addClickEventCategoryCheckboxes();
  ComponentEvent.getInstance().addScrollEventPaging();
  ComponentEvent.getInstance().addClickEventSearchButton();

  SearchService.getInstance().onLoadSearch();
};

let maxPage = 0;

//user가 검색할때 사용할거
const searchObj = {
  page: 1,
  searchValue: null,
  categories: new Array(),
  count: 10,
};

class SearchApi {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new SearchApi();
    }
    return this.#instance;
  }

  getCategories() {
    let returnData = null;

    $.ajax({
      async: false,
      type: "get",
      url: "http://localhost:8000/api/admin/categories",

      dataType: "json",

      success: (response) => {
        console.log(response);
        returnData = response.data;
      },
      error: (error) => {
        console.log(error);
      },
    });

    return returnData;
  }

  getTotalCount() {
    let responseData = null;
    $.ajax({
      async: false,
      type: "get",
      url: "http://localhost:8000/api/search/totalcount",
      data: searchObj,
      dataType: "json",
      success: (response) => {
        responseData = response.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
    return responseData;
  }

  searchBook() {
    let responseData = null;
    $.ajax({
      async: false,
      type: "get",
      url: "http://localhost:8000/api/search",
      data: searchObj,
      dataType: "json",
      success: (response) => {
        responseData = response.data;
      },
      error: error => {
        console.log(error);
      }
    });
    return responseData;
  }

  setLike(bookId){
    let likeCount = -1;
    
    $.ajax({
      async : false,
      type : "post",
      url : `http://localhost:8000/api/book/${bookId}/like`,
      dataType : "json",
      success : response => {
        likeCount = response.data;
      },
      error : error => {
        console.log(error);
      }
    });

    return likeCount;
  }

  setDisLike(bookId){
    let likeCount = -1;
    
    $.ajax({
      async : false,
      type : "delete",
      url : `http://localhost:8000/api/book/${bookId}/like`,
      dataType : "json",
      success : response => {
        likeCount = response.data;
      },
      error : error => {
        console.log(error);
      }
    });

    return likeCount;
  }

  rentalBook(bookId){
    let responseData = false;
    
    $.ajax({
      async : false,
      type : "post",
      url : `http://localhost:8000/api/rental/${bookId}`,
      dataType : "json",
      success : response => {
        responseData = response.data;
      },
      error : error => {
        console.log(error);
        alert(error.responseJSON.data.rentalCountError);
      }
    });

    return responseData;
  }

  returnBook(bookId){
    let responseData = false;
    
    $.ajax({
      async : false,
      type : "put",
      url : `http://localhost:8000/api/rental/${bookId}`,
      dataType : "json",
      success : response => {
        responseData = response.data;
      },
      error : error => {
        console.log(error);
        
      }
    });

    return responseData;
  }

}

class SearchService {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new SearchService();
    }
    return this.#instance;
  }

  onLoadSearch(){
    const URLSearch = new URLSearchParams(location.search);
    
    if(URLSearch.has("searchValue")){ //searchValue가 있는 물어봄

      const searchValue = URLSearch.get("searchValue");
      
      console.log(searchValue)
  
      if(searchValue ==""){
        return;
      } //공백이면 검색안됨.

      const searchInput = document.querySelector(".search-input");
      searchInput.value = searchValue;
      const searchButton = document.querySelector(".search-button");
      searchButton.click();

    } 

  }

  setMaxPage(){
    const totalCount = SearchApi.getInstance().getTotalCount();
    maxPage = totalCount %10 ==0 ? totalCount/10 : Math.floor(totalCount /10) +1;

  }

  loadCategories() {
    const categoryList = document.querySelector(".category-list");
    categoryList.innerHTML = ``;

    const responseData = SearchApi.getInstance().getCategories(); //responseData : 배열
    responseData.forEach((categoryObj) => {
      categoryList.innerHTML += `
        <div class="category-item">
          <input type="checkbox" class="category-checkbox" id="${categoryObj.category}" value="${categoryObj.category}">
          <label for="${categoryObj.category}">${categoryObj.category}</label>
        </div>
      `;
    });
  }

  clearBookList() {
    const contentFlex = document.querySelector(".content-flex");
    contentFlex.innerHTML = "";
  }

  loadSearchBooks() {
    const responseData = SearchApi.getInstance().searchBook();
    const contentFlex = document.querySelector(".content-flex");
    const principal = PrincipalApi.getInstance().getPrincipal();//로그인상태들고오기
    const _bookButtons = document.querySelectorAll(".book-buttons");

    const bookButtonsLength = _bookButtons == null ? 0 : _bookButtons.length;
        
    responseData.forEach((data, index) => {
      contentFlex.innerHTML += `
      <div class="info-container">
              
      <div class="book-desc">
        <div class="img-container">
          <img src="http://localhost:8000/image/book/${
            data.saveName != null ? data.saveName : "noimg.png"
          }" class="book-img" >
        </div>
        <div class="like-info"><i class="fa-regular fa-thumbs-up"></i><span class="like-count">${
          data.likeCount != null ? data.likeCount : 0
        }</span></div>
      </div>

      <div class="book-info">
        <input type="hidden" class="book-id" value="${data.bookId}">  
        <div class="book-code">${data.bookCode}</div>
        <h3 class="book-name">${data.bookName}</h3>
        <div class="info-text book-author"><b>저자: </b>${data.author}</div>
        <div class="info-text book-publisher"><b>출판사: </b>${
          data.publisher
        }</div>
        <div class="info-text book-publicationdate"><b>출판일: </b>${
          data.publicationDate
        }</div>
        <div class="info-text book-category"><b>카테고리: </b>${
          data.category
        }</div>
        <div class="book-buttons">
          
        </div>
      </div>
    </div>

      `;
      const bookButtons = document.querySelectorAll(".book-buttons");
      if(principal == null){
        if(data.rentalDtlId !=0 && data.returnDate == null){
          bookButtons[bookButtonsLength + index].innerHTML=`
            <button type="button" class="rental-button" disabled>대여중</button>
          `;
          }else{
            bookButtons[bookButtonsLength + index].innerHTML=`
              <button type="button" class="rental-button" disabled>대여가능</button>
            `;
          }
        
          bookButtons[bookButtonsLength + index].innerHTML +=`
            <button type="button" class="like-button" disabled>추천</button>
          `;
      }else{ //로그인되어져있음.
        if(data.rentalDtlId !=0 && data.returnDate == null && data.userId != principal.user.userId){ //남이빌렸다는 if
          bookButtons[bookButtonsLength + index].innerHTML=`
            <button type="button" class="rental-buttons rental-button" disabled>대여중</button>
          `;
        }else if(data.rentalDtlId !=0 && data.returnDate == null && data.userId == principal.user.userId){
          bookButtons[bookButtonsLength + index].innerHTML=`
            <button type="button" class="rental-buttons return-button" >반납하기</button>
          `;
        }else{
          bookButtons[bookButtonsLength + index].innerHTML=`
            <button type="button" class="rental-buttons rental-button" >대여하기</button>
          `;
        }

        if(data.likeId != 0){
          bookButtons[bookButtonsLength + index].innerHTML +=`
            <button type="button" class="like-buttons dislike-button">추천취소</button>
          `;
        }else{
          bookButtons[bookButtonsLength + index].innerHTML +=`
            <button type="button" class="like-buttons like-button">추천</button>
          `;
        }
        ComponentEvent.getInstance().addClickEventRentalButton();
        ComponentEvent.getInstance().addClickEventLikeButtons();
      }
      
    });
  }
}

class ComponentEvent {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new ComponentEvent();
    }
    return this.#instance;
  }

  addClickEventCategoryCheckboxes() {
    const checkboxes = document.querySelectorAll(".category-checkbox");

    checkboxes.forEach((checkbox) => {
      checkbox.onclick = () => {
        if (checkbox.checked) {
          searchObj.categories.push(checkbox.value); //categories : new Array() 여기 리스트로 넣는다.
        } else {
          const index = searchObj.categories.indexOf(checkbox.value); //indexof :배열의 위치 찾아줌.
          searchObj.categories.splice(index, 1); //배열위치부터 한개 지워라
        }
        console.log(searchObj.categories); //checkbox 조회
        // document.querySelector(".search-button").click(); => 카테고리 클릭시 바로 적용
      };
    });
  }

  addScrollEventPaging(){
    const html = document.querySelector("html");
    const body = document.querySelector("body");

    body.onscroll =() =>{
      console.log("client - offset - scrollTop : " + (body.offsetHeight -html.clientHeight - html.scrollTop));
      const scrollPosition = body.offsetHeight - html.clientHeight - html.scrollTop;

      if(scrollPosition < 250 && searchObj.page < maxPage){
        searchObj.page++;
        SearchService.getInstance().loadSearchBooks();
      }
    }
  }
  addClickEventSearchButton(){
    const searchButton =document.querySelector(".search-button")
    
    const searchInput = document.querySelector(".search-input");
    
    searchButton.onclick = () =>{
      searchObj.searchValue = searchInput.value;
      searchObj.page = 1;
      window.scrollTo(0,0);

      SearchService.getInstance().clearBookList();
      SearchService.getInstance().setMaxPage();
      SearchService.getInstance().loadSearchBooks();
    }

    searchInput.onkeyup = () =>{
      if(window.event.keyCode == 13){
        searchButton.click();
      }
    }

  }

  addClickEventLikeButtons(){
    const likeButtons = document.querySelectorAll(".like-buttons");
    const bookIds = document.querySelectorAll(".book-id");
    const likeCounts = document.querySelectorAll(".like-count");

    likeButtons.forEach((button, index) => {
      button.onclick = () =>{ //모든버튼에 onclick부여
        if(button.classList.contains("like-button")){ //추천
          const likeCount = SearchApi.getInstance().setLike(bookIds[index].value);
          
          if(likeCount != -1){
            likeCounts[index].textContent = likeCount;
            //↓ class바뀌니까 디자인 변경됨.
            button.classList.remove("like-button");
            button.classList.add("dislike-button");
            button.textContent = "추천취소";
          }
        }else{ //추천취소
          const likeCount = SearchApi.getInstance().setDisLike(bookIds[index].value);
          if(likeCount != -1){
            likeCounts[index].textContent = likeCount;          
            button.classList.remove("dislike-button");
            button.classList.add("like-button");
            button.textContent = "추천";
          }
        }

      }

    });
  }

  addClickEventRentalButton(){
    const rentalButtons = document.querySelectorAll(".rental-buttons");
    const bookIds = document.querySelectorAll(".book-id");

    rentalButtons.forEach((button, index) =>{
      button.onclick = ()=>{
        if(button.classList.contains("rental-button") && button.disabled == false){ //대여하기
          
          const flag = SearchApi.getInstance().rentalBook(bookIds[index].value);
          if(flag){
            button.classList.remove("rental-button");
            button.classList.add("return-button");
            button.textContent="반납하기";
          }
        }else if(button.classList.contains("return-button")){ //반납하기
          
          const flag = SearchApi.getInstance().returnBook(bookIds[index].value);
          if(flag){
            button.classList.remove("return-button");
            button.classList.add("rental-button");
            button.textContent="대여하기";
          }
        }
      }
    });
  }
}
