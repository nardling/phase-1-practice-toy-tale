let addToy = false;

const postConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
}

const addToyToDom = (toy) => {
  const toyCollection = document.getElementById("toy-collection")
  const newCard = document.createElement("div")
  newCard.className = "card"

  const newHeader = document.createElement("h2")
  newHeader.textContent = toy["name"]
  newCard.appendChild(newHeader)

  if (toy["name"] !== "Rex") {
    const newImg = document.createElement("img")
    newImg.src = toy["image"]
    newImg.className = "toy-avatar"
    newCard.appendChild(newImg)
  }

  const newP = document.createElement("p")
  newP.textContent = `${toy["likes"]} Likes`
  newCard.appendChild(newP)

  const newButton = document.createElement("button")
  newButton.className = "like-btn"
  newButton.id = toy["id"]
  newButton.textContent = "Like ❤️"
  newButton.addEventListener("click", (e) => {
    e.preventDefault()
    const likeString = e.target.parentNode.querySelector("p").textContent
    let numLikes = parseInt(likeString.replace(' Likes', ''))
    ++numLikes
    const url = "http://localhost:3000/toys/" + e.target.id
    const jsonData = {
      likes: numLikes.toString()
    }
    const lclPostConfig = {...postConfig,
      method: "PATCH",
      body:JSON.stringify(jsonData)}
    fetch(url, lclPostConfig)
      .then(res => res.json())
      .then(res => e.target.parentNode.querySelector("p").textContent = numLikes + " Likes")
      .catch(e => console.log(e))
    console.log(numLikes)
  })
  newCard.appendChild(newButton)

  toyCollection.appendChild(newCard)
}

const getCardsFromDB = () => {
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json() )
    .then(toys => toys.forEach(toy => {
      addToyToDom(toy)
    }))
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const createBtn = document.querySelector("form.add-toy-form")
  createBtn.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = e.target
    const jsonData = {
      name: formData["name"].value,
      image: formData["image"].value,
      likes: 0
    }
    const lclPostConfig = {...postConfig,
      method: "POST",
      body:JSON.stringify(jsonData)}
    fetch("http://localhost:3000/toys",
      lclPostConfig).
      then(res => 
        {
          res.json()
          console.log(res)
        }).
      then(dummy => addToyToDom(jsonData)).
      catch(e => {
        debugger
      })
  })

  getCardsFromDB()
});
