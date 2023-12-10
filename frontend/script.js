const BASE_URL = "http://localhost:8000/api/v1";
import { io } from "socket.io-client";
const socket = io("http://localhost:8000");

const notificationtype = {
  SUCCESS: { bgColor: "#007E33", color: "white" },
  DANGER: { bgColor: "#CC0000", color: "white" },
  WARNING: { bgColor: "#FF8800", color: "white" },
  INFO: { bgColor: "#0d47a1", color: "white" },
};

const loginPage = document.getElementById("login-page");
const signupPage = document.getElementById("signup-page");
const chatPage = document.getElementById("chat-page");
const navbarLogoutBtn = document.getElementById("navbar-logout-btn");
const navbarLoginBtn = document.getElementById("navbar-login-btn");
const navbarSignupBtn = document.getElementById("navbar-signup-btn");
const chatContainer = document.getElementById("chat-mid");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("msg-send-btn");

// call on first time load
onLoad();

function onLoad() {
  let token = localStorage.getItem("token");
  if (token) {
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
  } else {
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    chatPage.style.display = "none";
    navbarLogoutBtn.style.display = "none";
    navbarLoginBtn.style.display = "block";
    navbarSignupBtn.style.display = "block";
  }
}

const handleNavbarButtonClick = (buttonName) => {
  if (buttonName === "logout") {
    localStorage.removeItem("token");
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    chatPage.style.display = "none";
    navbarLogoutBtn.style.display = "none";
    navbarLoginBtn.style.display = "block";
    navbarSignupBtn.style.display = "block";
  } else if (buttonName === "signup") {
    signupPage.style.display = "block";
    loginPage.style.display = "none";
    chatPage.style.display = "none";
    // navbarLogoutBtn.style.display = "block";
    // navbarLoginBtn.style.display = "none";
    // navbarSignupBtn.style.display = "none";
  } else if (buttonName === "login") {
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    chatPage.style.display = "none";
    // navbarLogoutBtn.style.display = "block";
    // navbarLoginBtn.style.display = "none";
    // navbarSignupBtn.style.display = "none";
  }
};

function storeDataToLocalStorage(name, value) {
  if (name && value) {
    localStorage.setItem(name, value);
  }
}

// handle login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (!email?.trim() || !password?.trim()) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
  const data = {
    email,
    password,
  };
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);
    storeDataToLocalStorage("token", res.data.token);
    storeDataToLocalStorage("user", JSON.stringify(res.data.user));
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
    showNotification(3000, "successfully loggedin", "SUCCESS");
  } catch (error) {
    showNotification(3000, error.message, "DANGER");
    return;
  }
});

// handle login
signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
  const data = {
    name,
    email,
    password,
  };
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, data);
    storeDataToLocalStorage("token", res.data.token);
    storeDataToLocalStorage("user", JSON.stringify(res.data.user));
    console.log("RESPONSE", res.data);
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
    showNotification(3000, "successfully signed up", "SUCCESS");
  } catch (error) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
});

chatInput.addEventListener("keyup", async (event) => {
  let value = event.target.value;
  if (!value?.trim()) {
    sendBtn.style.color = "gray";
    sendBtn.style.cursor = "not-allowed";
  } else {
    sendBtn.style.color = "#007E33";
    sendBtn.style.cursor = "pointer";
  }
});

// let showNotification = true;
function showNotification(
  timeout = 3000,
  message = "This is a sample message",
  type = "SUCCESS"
) {
  // showNotification = false;
  let notificationBar = document.getElementById("snackbar");
  notificationBar.textContent = message;
  // Add the "show" class to DIV
  notificationBar.className = "show";
  notificationBar.style.backgroundColor = `${notificationtype[type].bgColor}`;
  notificationBar.style.color = `${notificationtype[type].color}`;

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    //   showNotification = false;
    notificationBar.className = notificationBar.className.replace("show", "");
  }, timeout);
}

sendBtn.addEventListener("click", () => {
  let value = chatInput.value;
  if (!value?.trim()) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
  let newContent = document.createElement("div");
  newContent.className = "client-msg-container";
  newContent.innerHTML = `<p class="client-msg">${value}</p>`;
  chatInput.value = "";
  sendBtn.style.color = "gray";
  sendBtn.style.cursor = "not-allowed";
  socket.emit("new-message", {
    message: value,
  });
  chatContainer.appendChild(newContent);
});

// const handleSubmit = () => {};
