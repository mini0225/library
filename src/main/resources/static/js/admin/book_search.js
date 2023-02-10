window.onload = () => {
  BookService.getInstance().loadBookList();
  BookService.getInstance().loadCategories();
  
  ComponentEvent.getInstance().addClickEventSearchButton();
  ComponentEvent.getInstance().addClickEventDeleteButton();
  ComponentEvent.getInstance().addClickEventDeleteCheckAll();
}

let searchObj = {
  page : 1,
  category : "",
  searchValue : "",
  order : "bookId",
  limit : "Y",
  count : 20
}

class BookSearchApi{
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookSearchApi();
    }
    return this.#instance;
  }

  getBookList(searchObj){
    let returnData = null;

    $.ajax({
      async:false,
      type :"get",
      url : "http://localhost:8000/api/admin/books",
      data :searchObj,
      dataType:"json",
      success:response =>{
        console.log(response);
        returnData = response.data;
      },
      error : error => {
        console.log(error);
      }

    });
    return returnData;
  }

  getBookTotalCount(searchObj){
    let returnData = null;

    $.ajax({
      async:false,
      type :"get",
      url : "http://localhost:8000/api/admin/books/totalcount",
      data : {
          "category" : searchObj.category,
          "searchValue" : searchObj.searchValue
      },
      dataType:"json",
      success:response =>{
        console.log(response);
        returnData = response.data;
      },
      error : error => {
        console.log(error);
      }

    });
    return returnData;
  }

  getCategories() {
    let returnData = null;

    $.ajax({
      async:false,
      type :"get",
      url : "http://localhost:8000/api/admin/categories",
      data :searchObj,
      dataType:"json",
      success:response =>{
        console.log(response);
        returnData = response.data;
      },
      error : error => {
        console.log(error);
      }

    });

    return returnData;
  }
  deleteBooks(deleteArray){
    let returnFlag = false;

    $.ajax({
        async : false,
        type : "delete",
        url : "http://localhost:8000/api/admin/books",
        contentType : "application/json",
        data : JSON.stringify(
          {userIds: deleteArray}  //{key : value}
        ),
        dataType :"json",

        success:response =>{
          returnFlag = true;
        },
        error : error => {
          console.log(error);
        }
    })
    return returnFlag;
  };
  

}

class BookService{
  static #instance = null;
  static getInstance() {
    if(this.#instance ==null) {
      this.#instance = new BookService();
    }
    return this.#instance;
  }
  loadBookList(){
    const responseData = BookSearchApi.getInstance().getBookList(searchObj);
    
    const checkAll = document.querySelector(".delete-checkall");
    checkAll.checked = false;
    //loadBookList 실행될때 마다 전체체크 풀기

    const bookListBody = document.querySelector(".content-table tbody");
    bookListBody.innerHTML = "";

    responseData.forEach((data, index) => {
      bookListBody.innerHTML += `
        <tr>
          <td><input type="checkbox" class ="delete-checkbox"></td>
          <td class = "book-id">${data.bookId}</td>
          <td>${data.bookCode}</td>
          <td>${data.bookName}</td>
          <td>${data.author}</td>
          <td>${data.publisher}</td>
          <td>${data.publicationDate}</td>
          <td>${data.category}</td>
          <td>${data.rentalStatus =="Y" ? "대여중" : "대여가능"}</td>
          <td><a href="/templates/admin/book_modification.html?bookCode=${data.bookCode}"><i class="fa-solid fa-square-pen"></i></a></td>
         </tr>
      `;
    });
    this.loadSearchNumberList();
    ComponentEvent.getInstance().addClickEventDeleteCheckbox();
  }

  loadSearchNumberList(){
    
    const pageController = document.querySelector(".page-controller");
    pageController.innerHTML ="";

    const totalCount = BookSearchApi.getInstance().getBookTotalCount(searchObj);
    const maxPageNumber = totalCount % searchObj.count == 0 
                        ? Math.floor(totalCount /searchObj.count) 
                        : Math.floor(totalCount / searchObj.count) +1;
  
    
    
    //↓javascript:void(0) : 하이퍼 링크 동작 막기
    pageController.innerHTML =`
      <a href="javascript:void(0)" class="pre-button disabled">이전</a>
        <ul class="page-numbers">
          
        </ul>
      <a href="javascript:void(0)" class="next-button disabled">다음</a>
    `;

    //위에서 기본적으로 이전버튼 다음버튼 은 disabled 상태임
    //밑에서 disabled를 remove해서 활성화 시킴
    if(searchObj.page != 1){
      const preButton = pageController.querySelector(".pre-button");
      preButton.classList.remove("disabled");

      preButton.onclick = () => {
        
        searchObj.page--; //이전버튼 누를때 마다 -1 되어야 하니까, 동일 searchObj.page -=1
        this.loadBookList();
        
      }
    }

    if(searchObj.page != maxPageNumber){
      const nextButton = pageController.querySelector(".next-button");
      nextButton.classList.remove("disabled");

      nextButton.onclick = () => {
        
        searchObj.page++; //이전버튼 누를때 마다 +1 되어야 하니까, 동일 searchObj.page -=1
        this.loadBookList();
        
      }
    }

    //중간 pageNumber 들은 처음과 끝의 index를 구해서.... 공식 필요
    const startIndex = searchObj.page%5 ==0 
                    ?searchObj.page - 4 
                    : searchObj.page - (searchObj.page%5) + 1;

    const endIndex = startIndex + 4 <= maxPageNumber
                    ? startIndex + 4
                    : maxPageNumber;

    const pageNumbers = document.querySelector(".page-numbers");

    for(let i = startIndex; i<=endIndex; i++){
      pageNumbers.innerHTML+=`
        <a href="javascript:void(0)" 
        class ="page-button ${i == searchObj.page ? "disabled" : ""}"><li>${i}</li></a>
      `
    }
    //pageNumber != searchObj.page 해당페이지는 활성화 시킬필요 없으니까 != 임.
    const pageButtons = document.querySelectorAll(".page-button");
    pageButtons.forEach(button =>{
      const pageNumber = button.textContent;
      if(pageNumber != searchObj.page){
        button.onclick =()=>{
          searchObj.page = pageNumber;
          this.loadBookList();
        }
      }
    });
  }



  loadCategories(){
    const responseData = BookSearchApi.getInstance().getCategories();
    
    const categorySelect = document.querySelector(".category-select");
    categorySelect.innerHTML =`<option value="">전체조회</option>`;

    responseData.forEach(data =>{
      categorySelect.innerHTML +=`
      <option value="${data.category}">${data.category}</option>
      `;
    });
  }

  removeBooks(deleteArray) {
    let successFlag = BookSearchApi.getInstance().deleteBooks(deleteArray); //<-호출
    
    if(successFlag = true){
      searchObj.page = 1;
      this.loadBookList();  
    }
    
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

  addClickEventSearchButton() {
    const categorySelect = document.querySelector(".category-select");
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-button");

    searchButton.onclick = () => {
      searchObj.category = categorySelect.value;
      searchObj.searchValue = searchInput.value;

      //검색시에 무조건 1번page 부터 나올수있게
      searchObj.page =1;

      BookService.getInstance().loadBookList();
    }

    searchInput.onkeyup = () => {
      if(window.event.keyCode == 13){ //13 = 키보드 상 enter 
        searchButton.click();
      }
    }
  }

  addClickEventDeleteButton(){
    const deleteButton = document.querySelector(".delete-button")
    deleteButton.onclick = () => {
      if(confirm("정말로 삭제하시겠습니까?")){
        const deleteArray = new Array(); 
      
        const deleteCheckboxes = document.querySelectorAll(".delete-checkbox")
        deleteCheckboxes.forEach((deleteCheckbox, index) => {
          if(deleteCheckbox.checked) { //check 되어져 있으면 true
            const bookIds = document.querySelectorAll(".book-id");
            console.log("bookId : " + bookIds[index].textContent);

            deleteArray.push(bookIds[index].textContent);
          }
        });

      BookService.getInstance().removeBooks(deleteArray);
    }
  }
}

  addClickEventDeleteCheckAll(){
    const checkAll = document.querySelector(".delete-checkall");
    checkAll.onclick =()=>{
      const deleteCheckboxes = document.querySelectorAll(".delete-checkbox");
      deleteCheckboxes.forEach(deleteCheckbox => {
        deleteCheckbox.checked = checkAll.checked;
      });
    }
  }

  addClickEventDeleteCheckbox(){
    const deleteCheckboxes = document.querySelectorAll(".delete-checkbox");
    const checkAll = document.querySelector(".delete-checkall");

    deleteCheckboxes.forEach(deleteCheckbox => {
      deleteCheckbox.onclick=()=>{
        
        const deleteCheckedCheckboxes = document.querySelectorAll(".delete-checkbox:checked");
        //onclick 이 일어났을때 checkedcheckbox 갯수가 바뀌니까 여기들어와야함.
        
        console.log("선택 : " + deleteCheckedCheckboxes.length);
        console.log("전체 : " + deleteCheckboxes.length);

        if(deleteCheckedCheckboxes.length == deleteCheckboxes.length){ //체크된 애들, 그냥 빈 체크박스
          checkAll.checked =true;
        }else{
          checkAll.checked = false;
        }
      }
    });
  }

}

