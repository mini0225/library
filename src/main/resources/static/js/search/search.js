window.onload = () =>{
  SearchService.getInstance().loadCategories();

  ComponentEvent.getInstance().addClickEventCategoryCheckboxes();

}

//user가 검색할때 사용할거
const searchObj = {
  page:1,
  searchValue : null,
  categories : new Array(),
  count : 10
}

class SearchApi {
  static #instance = null;
  static getInstance (){
    if(this.#instance == null){
      this.#instance = new SearchApi();  
    }
    return this.#instance;
  }

  getCategories() {
    let returnData = null;

    $.ajax({
      async:false,
      type :"get",
      url : "http://127.0.0.1:8000/api/admin/categories",
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

}


class SearchService {
  static #instance = null;
  static getInstance (){
    if(this.#instance == null){
      this.#instance = new SearchService();  
    }
    return this.#instance;
  }

  loadCategories(){
    const categoryList = document.querySelector(".category-list");
    categoryList.innerHTML=``;

    const responseData = SearchApi.getInstance().getCategories(); //responseData : 배열
    responseData.forEach(categoryObj =>{
      categoryList.innerHTML +=`
        <div class="category-item">
          <input type="checkbox" class="category-checkbox" id="${categoryObj.category}" value="${categoryObj.category}">
          <label for="${categoryObj.category}">${categoryObj.category}</label>
        </div>
      `;

    });
  }

}

class ComponentEvent{
  static #instance = null;
  static getInstance (){
    if(this.#instance == null){
      this.#instance = new ComponentEvent();  
    }
    return this.#instance;
  }

  addClickEventCategoryCheckboxes () {
    const checkboxes = document.querySelectorAll(".category-checkbox");
    
    checkboxes.forEach(checkbox => {
      checkbox.onclick = () =>{
        if(checkbox.checked) {
          searchObj.categories.push(checkbox.value); //categories : new Array() 여기 리스트로 넣는다.
        }else{
          const index = searchObj.categories.indexOf(checkbox.value);//indexof :배열의 위치 찾아줌.
          searchObj.categories.splice(index,1); //배열위치부터 한개 지워라
        }
        console.log(searchObj.categories); //checkbox 조회
      }
    });
   

  }

}