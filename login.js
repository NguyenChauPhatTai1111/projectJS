const loginForm =
    document.querySelector("#login-form");

const emailInput =
    document.querySelector("#email");


const passwordInput =
    document.querySelector("#password");


const emailError =
    document.querySelector("#email-error");


const passwordError =
    document.querySelector("#password-error");


const loginError =
    document.querySelector("#login-error");


/*
|--------------------------------------------------------------------------
| CHECK ĐÃ LOGIN CHƯA
|--------------------------------------------------------------------------
*/

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn === "true") {

    window.location.href = "index.html";

}

/*
|--------------------------------------------------------------------------
| VALIDATE EMAIL
|--------------------------------------------------------------------------
*/

function validateEmail() {

    const email =
        emailInput.value.trim();


    // Không nhập
    if (email === "") {

        emailError.textContent =
            "Vui lòng nhập email.";

        emailInput.classList.add(
            "input-error"
        );

        return false;
    }


    // Check format email
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        emailError.textContent =
            "Email không đúng định dạng.";

        emailInput.classList.add(
            "input-error"
        );

        return false;
    }


    // Hợp lệ
    emailError.textContent = "";

    emailInput.classList.remove(
        "input-error"
    );

    return true;
}


/*
|--------------------------------------------------------------------------
| VALIDATE PASSWORD
|--------------------------------------------------------------------------
*/

function validatePassword() {

    const password =
        passwordInput.value;


    // Không nhập
    if (password === "") {

        passwordError.textContent =
            "Vui lòng nhập mật khẩu.";

        passwordInput.classList.add(
            "input-error"
        );

        return false;
    }


    // Ít hơn 6 ký tự
    if (password.length < 6) {

        passwordError.textContent =
            "Mật khẩu phải có ít nhất 6 ký tự.";

        passwordInput.classList.add(
            "input-error"
        );

        return false;
    }


    // Hợp lệ
    passwordError.textContent = "";

    passwordInput.classList.remove(
        "input-error"
    );

    return true;
}


/*
|--------------------------------------------------------------------------
| VALIDATE KHI USER RỜI INPUT
|--------------------------------------------------------------------------
*/

emailInput.addEventListener(
    "blur",
    validateEmail
);


passwordInput.addEventListener(
    "blur",
    validatePassword
);


/*
|--------------------------------------------------------------------------
| XÓA ERROR KHI USER ĐANG NHẬP
|--------------------------------------------------------------------------
*/

emailInput.addEventListener(
    "input",
    function () {

        emailError.textContent = "";

        emailInput.classList.remove(
            "input-error"
        );

        loginError.textContent = "";

    }
);


passwordInput.addEventListener(
    "input",
    function () {

        passwordError.textContent = "";

        passwordInput.classList.remove(
            "input-error"
        );

        loginError.textContent = "";

    }
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.querySelector("#email").value.trim();

        const password =
            document.querySelector("#password").value;


        try {

            /*
            |--------------------------------------------------------------------------
            | ĐỌC USERS.JSON
            |--------------------------------------------------------------------------
            */

            const response =
                await fetch("./users.json");


            if (!response.ok) {

                throw new Error(
                    "Không thể đọc users.json"
                );

            }


            const users =
                await response.json();


            /*
            |--------------------------------------------------------------------------
            | TÌM USER
            |--------------------------------------------------------------------------
            */

            const user =
                users.find(function (user) {

                    return (
                        user.email === email &&
                        user.password === password
                    );

                });


            /*
            |--------------------------------------------------------------------------
            | LOGIN THÀNH CÔNG
            |--------------------------------------------------------------------------
            */

            if (user) {

                console.log(
                    "Login thành công:",
                    user
                );


                // Lưu trạng thái login
                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                // Lưu user
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                // Chuyển trang
                window.location.href =
                    "index.html";


            } else {

                /*
                |--------------------------------------------------------------------------
                | LOGIN SAI
                |--------------------------------------------------------------------------
                */

                loginError.textContent =
                    "Email hoặc mật khẩu không đúng.";

            }


        } catch (error) {

            console.error(error);

            loginError.textContent =
                "Có lỗi xảy ra khi đăng nhập.";

        }

    }
);