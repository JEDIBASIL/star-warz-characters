const cardContainer = document.querySelector(".card_container");
const searchInput = document.querySelector(".search-box")
const modal = document.querySelector(".modal")
const paginationContent = document.querySelector(".pagination_content")
const paginationPrev = document.querySelector(".prev")
const paginationNext = document.querySelector(".next")


// variable that holds the data fetched
let starWarzData = [];

// variable that holds the filtered data from the search input
let filteredStarWarzData = []

// variable that holds the page number
let paginationIndex = 1;

// variable that holds the maximum number of pages
let maxPage;

// the controller is used to abort request
const controller = new AbortController()

// it update the card container with loaders
const cardUILoader = () => {
    for (let i = 1; i < 9; i++) {
        cardContainer.innerHTML += `
            <div class="loader_card" >
                <div class="image"></div>
                <div class="details_container">
                <p class="text"></p>
            </div> `;
    }
};

// it update the gotten data
const cardUI = (name, color, i) => {
    cardContainer.innerHTML += `
        <div class="card" role="${i}">
            <img  style="background-color:#${color} ;" src="https://robohash.org/${name}" role="${i}" />
            <div class="details_container" role="${i}">
              <h3 role="${i}">${name}</h3>
            </div>
        </div>`;
};

// it update the modal with the character clicked
const modalUI = ({ name, height, gender, color = "808080" }) => {
    modal.innerHTML = `
    <div class="modal_content">
    <span class="material-symbols-outlined close_icon">close</span>
    <img style="background-color:#${color}" src="https://robohash.org/${name}" alt="">
    <div>
      <div class="details_container"><h4>Name: </h4> ${name}</div>
      <div class="details_container"><h4>Gender: </h4> ${gender}</div>
      <div class="details_container"><h4>Height: </h4> ${height}</div>
    </div>
  </div>
</div>`
}

// it display message on the screen for errors and search not found
const messageUI = (iconName, title,messageType) => { 
    cardContainer.innerHTML = `
                <div class="error_container">
                    <span class="material-symbols-outlined">
                    ${iconName}
                    </span>
                    <h2>${title}</h2>
                    ${messageType === "notLoaded" ? '<button class="reload_btn"> Retry </button>':""}
                </div>
            `
}

// it filters the fetched data that matches the value of the search input
const updateSearch = (value = "") => {
    cardContainer.innerHTML = ""
    filteredStarWarzData = starWarzData
        .filter(data => data.name.toLowerCase().includes(value.toLowerCase().trim()))
    filteredStarWarzData.map(({ name, color }, i) => cardUI(name, color, i))
}

// it update pagination button container based on the ammount of page and each character displayed
const updatePageContent = (resourceLength, pageCount) => {
    let marker = resourceLength / pageCount + "";
    marker = marker.split(".")
    marker = marker[1] !== undefined ? parseInt(marker[0]) + 1 : parseInt(marker[0])
    maxPage = marker
    let HtmlContent;
    for (let i = 1; i < marker + 1; i++) {
        HtmlContent += `<button>${i}</button>`
    }
    paginationContent.innerHTML = HtmlContent.replace("undefined", ".");
}

// it disable the pagination navigation button base on where the current page is
const disablePaginationNavigationButton = () => {
    paginationIndex == 1 ? paginationPrev.disabled = true : paginationPrev.disabled = false
    paginationIndex == maxPage ? paginationNext.disabled = true : paginationNext.disabled = false
}


// it updates the pagination button to match the current page
const updatePaginationIndicator = () => {
    paginationContent.childNodes.forEach(indicator => indicator.className = "")
    paginationContent.childNodes[paginationIndex].className = "active"
}

// it disables every pagination button
const disablePaginationBtn = () => {
    paginationPrev.disabled = true
    paginationNext.disabled = true
    document.querySelectorAll(".pagination_content button")
        .forEach(button => button.disabled = true)
}

// it changes the disabled state of the search input based on the argument passed
const ChangeSearchBarState = (state) => {
    searchInput.value = ""
    searchInput.disabled = state
}

// it updates the card container with the loader ui before the data is fetched
const updateUI = () => {
    cardContainer.innerHTML = ""
    cardUILoader()
}

// it fetches the data from the api base on the page number passed as an argument
const fetchData = (pageNumber) => {
    window.scrollTo(0, 0)
    const signal = controller.signal
    disablePaginationBtn()
    ChangeSearchBarState(true)
    fetch(`https://swapi.dev/api/people?page=${pageNumber}`, { signal }, { method: "GET", headers: { "Content-Type": "application / json", }, })
        .then((res) => res.json())
        .then((data) => {
            updatePageContent(data.count, 10)
            updatePaginationIndicator()
            disablePaginationNavigationButton()
            starWarzData = data.results;
            starWarzData.map(data => {
                var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                data.color = randomColor;
            })
            updateSearch("")
            cardContainer.innerHTML = ""
            filteredStarWarzData.map(({ name, color }, i) => cardUI(name, color, i))
            ChangeSearchBarState(false)
        }).catch(() => {
            messageUI("wifi_off", "An error occurred","notLoaded")
            disablePaginationBtn()
            maxPage = 1;
        })

}

// ▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎ IMPLEMENTING THE FUNCTION ▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎▶︎


cardUILoader();

searchInput.addEventListener("input", (e) => {
    updateSearch(e.target.value)
    if (filteredStarWarzData.length === 0) messageUI("search_off", "No match","message");
})

fetchData(paginationIndex);

cardContainer.addEventListener("click", (e) => {
    const characterIndex = e.target.role;
    if (!isNaN(characterIndex) && characterIndex !== null) {
        modal.style.display = "flex"
        const character = filteredStarWarzData[characterIndex];
        modalUI({ ...character })
    }
    if(e.target.className ==="reload_btn"){
       window.location.reload()
    }
})

paginationContent.addEventListener("click", (e) => {
    paginationIndex = parseInt(e.target.textContent)
    updateUI()
    disablePaginationBtn()
    paginationContent.disabled = "true"
    fetchData(paginationIndex)
})


paginationPrev.addEventListener("click", () => {
    --paginationIndex
    updateUI()
    disablePaginationBtn()
    fetchData(paginationIndex);
})

paginationNext.addEventListener("click", () => {
    ++paginationIndex
    updateUI()
    disablePaginationBtn()
    fetchData(paginationIndex);
})



modal.addEventListener("click", (e) => (e.target.className.includes("close_icon") || e.target.className === "modal") ? modal.style.display = "none" : null)

