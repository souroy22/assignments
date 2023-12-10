const BASE_URL = "https://goodspace-assignment.onrender.com/api/v1";
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
const noChat = document.getElementById("no-chat");
const userName = document.getElementById("user-name");

// call on first time load
onLoad();

async function onLoad() {
  let token = await localStorage.getItem("token");
  await loadOldChats();
  if (token) {
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
    const userData = JSON.parse(localStorage.getItem("user")).name;
    userName.innerText = `Hi, ${userData}`;
    userName.style.display = "inline-block";
  } else {
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    chatPage.style.display = "none";
    navbarLogoutBtn.style.display = "none";
    navbarLoginBtn.style.display = "block";
    navbarSignupBtn.style.display = "block";
    userName.style.display = "none";
  }
}

async function loadOldChats() {
  let userid = JSON.parse(localStorage.getItem("user")).id;
  const chats = await axios.get(`${BASE_URL}/chats/get-old-chats/${userid}`);
  if (!chats.data.chats.length) {
    noChat.style.display = "flex";
  } else {
    noChat.style.display = "none";
    for (let chat of chats.data.chats) {
      console.log("Chat", chat);
      const msgType = chat.userType === "user" ? "CLIENT" : "BOT";
      addNewChat(msgType, chat.text);
    }
  }
}

const handleNavbarButtonClick = async (buttonName) => {
  if (buttonName === "logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    chatContainer.innerHTML = "";
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    chatPage.style.display = "none";
    navbarLogoutBtn.style.display = "none";
    navbarLoginBtn.style.display = "block";
    navbarSignupBtn.style.display = "block";
    userName.style.display = "none";
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

navbarLogoutBtn.addEventListener("click", () =>
  handleNavbarButtonClick("logout")
);
navbarLoginBtn.addEventListener("click", () =>
  handleNavbarButtonClick("login")
);
navbarSignupBtn.addEventListener("click", () =>
  handleNavbarButtonClick("signup")
);

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
    userName.innerText = `Hi, ${res.data.user.name}`;
    userName.style.display = "inline-block";
    storeDataToLocalStorage("token", res.data.token);
    storeDataToLocalStorage("user", JSON.stringify(res.data.user));
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
    await loadOldChats();
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
    userName.innerText = `Hi, ${res.data.user.name}`;
    userName.style.display = "inline-block";
    storeDataToLocalStorage("token", res.data.token);
    storeDataToLocalStorage("user", JSON.stringify(res.data.user));
    console.log("RESPONSE", res.data);
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    chatPage.style.display = "block";
    navbarLogoutBtn.style.display = "block";
    navbarLoginBtn.style.display = "none";
    navbarSignupBtn.style.display = "none";
    await loadOldChats();
    showNotification(3000, "successfully signed up", "SUCCESS");
  } catch (error) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
});

function addNewChat(msgType = "CLIENT", msg) {
  let newContent = document.createElement("div");
  newContent.className =
    msgType === "CLIENT" ? "client-msg-container" : "bot-msg-container";
  newContent.innerHTML = `<p class="${
    msgType === "CLIENT" ? "client-msg" : "bot-msg"
  }">${msg}</p>`;
  chatContainer.appendChild(newContent);
  chatContainer.scroll(0, chatContainer.scrollHeight);
}

const handleMsgSubmit = async () => {
  let value = chatInput.value;
  if (!value?.trim()) {
    showNotification(3000, "Please fill all the fields", "DANGER");
    return;
  }
  addNewChat("CLIENT", value);
  chatInput.value = "";
  sendBtn.style.color = "gray";
  sendBtn.style.cursor = "not-allowed";
  let data = localStorage.getItem("user");

  data = JSON.parse(data);
  const id = data.id;
  noChat.style.display = "none";
  socket.emit("new-message", {
    message: value,
    userId: id,
  });
};

chatInput.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    handleMsgSubmit();
    return;
  }
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

sendBtn.addEventListener("click", handleMsgSubmit);

socket.on("bot-reply", (message) => {
  addNewChat("BOT", message);
});
