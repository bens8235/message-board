const form = document.getElementById("messageForm");

async function addElements(formData) {
  //creating new div for message, number of likes, del button & like button to go in.

  const div = document.createElement("div");
  const p = document.createElement("p");
  const likes = document.createElement("p");
  const delBtn = document.createElement("button");
  const likeBtn = document.createElement("button");

  //uppdating  content of p for messages/username & buttons

  p.textContent = `${formData.username}: ${formData.message}`;
  delBtn.textContent = "❌";
  likeBtn.textContent = "👍";

  //fetching database info again to use it to create classname's to correspond to database
  const response = await fetch(
    "https://message-board-server.onrender.com/messages"
  );
  const messages = await response.json();

  let className = formData.id || messages[messages.length - 1].id;
  delBtn.classList.add(`n${className}`);
  div.classList.add(`n${className}`);
  likes.classList.add(`l${className}`);
  likeBtn.setAttribute("id", `n${className}`);
  let likeBtnClass = formData.likes || messages[messages.length - 1].likes;
  if (likeBtnClass === null) {
    likeBtn.classList.add("n0");
    likes.textContent = "0" + "👍";
  } else {
    likeBtn.classList.add(`n${likeBtnClass}`);
    likes.textContent = likeBtnClass + "👍";
  }

  const messageContainer = document.getElementById("messageContainer");
  messageContainer.appendChild(div);
  div.appendChild(p);
  div.append(likes);
  div.appendChild(likeBtn);
  div.appendChild(delBtn);

  //event listener for del button to delete entry and removing div from html.

  delBtn.addEventListener("click", async function () {
    await fetch("https://message-board-server.onrender.com/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ class: delBtn.className }),
    });
    let divClass = delBtn.className;
    document.querySelector(`.${divClass}`).remove();
  });

  //event listener for like button to add likes and update screen

  likeBtn.addEventListener("click", async function () {
    let likeId = likeBtn.className;
    let likes = document.querySelector(`.${likeBtn.id.replace("n", "l")}`);
    likeId = Number(likeId.slice(1)) + 1;
    likeBtn.className = `n${likeId}`;
    likes.textContent = likeId + "👍";
    await fetch("https://message-board-server.onrender.com/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ class: likeBtn.className, id: likeBtn.id }),
    });
  });
}

//Event listener on form send button to update database with the form data. Will then run addElements to display it straight away on screen.

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);

  await fetch("https://message-board-server.onrender.com/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  form.reset();
  addElements(formValues);
});

//uses our database api to get database info and runs our addElements function  for each item in the database.

async function getMessages() {
  const response = await fetch(
    "https://message-board-server.onrender.com/messages"
  );
  const messages = await response.json();

  for (let i = 0; i < messages.length; i++) {
    addElements(messages[i]);
  }
}

//When program is first run we will get all database info and display on the screen and add event listeners to del/like button

getMessages();
