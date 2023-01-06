window.onload = () => {
  RegisterEvent.getInstance().addRegisterSubmitOnclickEvent();
};

class RegisterApi {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new RegisterApi(); //'==' 대입이 아니라 비교임 , 위에 getInstance 가 null이라서 호출할수가 없음.
    }
    return this.#instance;
  }

  register(user) {
    //user 등록할때마다

    $.ajax({ // ajax 오류는 이거 100% => "http://code.jquery.com/jquery-latest.min.js" 
      async: false,
      type: "post",
      url: "/api/account/register",
      contentType: "application/json",
      data: JSON.stringify(user),
      dataType: "json",
      success: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);

        RegisterService.getInstance().setErrorMessage(error.responseJSON.data);
      },
    });
  }
}

class RegisterService {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new RegisterService();
    }
    return this.#instance;
  }

  setErrorMessage(errors) {
    const registerError = document.querySelectorAll(".register-error");

    this.#clearErrorMessage();

    Object.keys(errors).forEach((error) => {
      if (error == "username") {
        registerError[0].textContent = errors[error];
      } else if (error == "password") {
        registerError[1].textContent = errors[error];
      } else if (error == "repassword") {
        registerError[2].textContent = errors[error];
      } else if (error == "name") {
        registerError[3].textContent = errors[error];
      } else if (error == "email") {
        registerError[4].textContent = errors[error];
      }
    });
  }

  #clearErrorMessage() {
    // '#' 붙으면 private
    const registerError = document.querySelectorAll(".register-error");
    registerError.forEach((error) => {
      error.textContent = "";
    });
  }
}

class RegisterEvent {
  static #instance = null;
  static getInstance() {
    if (this.#instance == null) {
      this.#instance = new RegisterEvent();
    }
    return this.#instance;
  }

  addRegisterSubmitOnclickEvent() {
    const registerSubmit = document.querySelector(".register-submit"); //'.' 빼먹는경우...ㅎㅎ ". = #"클래스 물고온다

    registerSubmit.onclick = () => {
      const usernameValue =
        document.querySelectorAll(".register-inputs")[0].value; //대문자 Value 아님,,,,validation check 이후에도 공백이라고 뜸. userDto에서 값이 없기때문임.
      const passwordValue =
        document.querySelectorAll(".register-inputs")[1].value;
      const repasswordValue =
        document.querySelectorAll(".register-inputs")[2].value;
      const nameValue = document.querySelectorAll(".register-inputs")[3].value;
      const emailValue = document.querySelectorAll(".register-inputs")[4].value;

      const user = new User(
        usernameValue,
        passwordValue,
        repasswordValue,
        nameValue,
        emailValue
      );

      RegisterApi.getInstance().register(user);
    };
  }
}

class User {
  username = null;
  password = null;
  repassword = null;
  name = null;
  email = null;

  constructor(username, password, repassword, name, email) {
    this.username = username;
    this.password = password;
    this.repassword = repassword;
    this.name = name;
    this.email = email;
  }
}
