function handleLogin(event) {
    event.preventDefault();

    let loginInput = document.getElementById("username");
    let password = document.getElementById("password").value;
    loginInput.value = loginInput.value.replace(/[^a-zA-Z0-9_.@+-]/g, "");
    let login = loginInput.value;
    let loginRegex = /^[a-zA-Z0-9_.-]{3,20}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phoneRegex = /^(\+380|0)\d{9}$/;

    let isLogin = login.match(loginRegex);
    let isEmail = login.search(emailRegex) !== -1;
    let isPhone = login.search(phoneRegex) !== -1;

    if (!isLogin && !isEmail && !isPhone) {
        alert("❌ Невірний login, email або phone");
        return false;
    }

    if (password.length < 6) {
        alert("❌ Пароль має бути мінімум 6 символів");
        return false;
    }

    alert("✅ Дані введено правильно!");
    return true;
}
