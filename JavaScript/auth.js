/* =========================
   AUTH CONFIG
========================= */
const USERS_KEY = "royce_users";
const CURRENT_USER_KEY = "royce_current_user";

/* =========================
   HELPERS
========================= */
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

/* =========================
   VALIDATION
========================= */
function validateEmail() {
    const email = document.getElementById("email");
    if (!email) return true;

    const alertBox = document.getElementById("invalidEmail");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = regex.test(email.value.trim());
    alertBox.style.display = isValid ? "none" : "block";
    return isValid;
}

function validatePassword() {
    const password = document.getElementById("password");
    if (!password) return true;

    const alertBox = document.getElementById("invalidPass");
    const isValid = password.value.length >= 8;

    alertBox.style.display = isValid ? "none" : "block";
    return isValid;
}

function validateConfirmPassword() {
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");
    const alertBox = document.getElementById("invalidConfirmPass");

    if (!confirm) return true;

    const isValid = password.value === confirm.value && confirm.value !== "";
    alertBox.style.display = isValid ? "none" : "block";
    return isValid;
}

/* =========================
   SIGNUP (NO AUTO LOGIN)
========================= */
function signup() {
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!fname || !lname) {
        alert("Please enter first and last name.");
        return;
    }

    if (!validateEmail() || !validatePassword() || !validateConfirmPassword()) {
        alert("Please fix the errors before continuing.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = getUsers();

    const userExists = users.some(u => u.email === email);
    if (userExists) {
        alert("This email is already registered. Please login.");
        return;
    }

    const newUser = {
        id: Date.now(),
        fname,
        lname,
        email,
        password, // frontend demo only
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    alert("Account created successfully! Please login.");
    window.location.href = "login.html";
}

/* =========================
   LOGIN
========================= */
function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!validateEmail() || !validatePassword()) return;

    const users = getUsers();
    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    setCurrentUser(user);
    alert("Login successful!");
    window.location.href = "index.html";
}

/* =========================
   LOGOUT
========================= */
function logout() {
    clearCurrentUser();
    window.location.href = "login.html";
}

/* =========================
   UI STATE (HEADER)
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();

    const displayLogin = document.getElementById("display_login");
    const loginBtn = document.getElementById("login_btn");
    const userName = document.getElementById("user_name");

    if (!displayLogin || !loginBtn) return;

    if (user) {
        displayLogin.style.display = "flex";
        loginBtn.style.display = "none";
        userName.textContent = user.fname;
    } else {
        displayLogin.style.display = "none";
        loginBtn.style.display = "inline-flex";
    }
});
