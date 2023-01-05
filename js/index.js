const cardContainer = document.querySelector(".card_container");
const searchInput = document.querySelector(".search-box")
const modal = document.querySelector(".modal")
const paginationContent = document.querySelector(".pagination_content")
const paginationPrev = document.querySelector(".prev")
const paginationNext = document.querySelector(".next")



let starWarzData = [];
let filteredStarWarzData = []
let paginationIndex = 1;
let maxPage;

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

const cardUI = (name, color, i) => {
    cardContainer.innerHTML += `
        <div class="card" role="${i}">
            <img  style="background-color:#${color} ;" src="https://robohash.org/${name}" role="${i}" />
            <div class="details_container" role="${i}">
              <h3 role="${i}">${name}</h3>
            </div>
        </div>`;
};

const modalUI = ({ name, height, gender, color="gray" }) => {
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

const messageUI = (iconName, title) => {
    cardContainer.innerHTML = `
                <div class="error_container">
                    <span class="material-symbols-outlined">
                    ${iconName}
                    </span>
                    <h2>${title}</h2>
                </div>
            `
}

const updateSearch = (value = "") => {
    cardContainer.innerHTML = ""
    filteredStarWarzData = starWarzData
        .filter(data => data.name.toLowerCase().includes(value.toLowerCase().trim()))
    filteredStarWarzData.map(({ name, color }, i) => cardUI(name, color, i))
}




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

const disablePaginationNavigationButton = () => {
    paginationIndex == 1 ? paginationPrev.disabled = true : paginationPrev.disabled = false
    paginationIndex == maxPage ? paginationNext.disabled = true : paginationNext.disabled = false
}


const updatePaginationIndicator = () => {
    paginationContent.childNodes.forEach(indicator => indicator.className = "")
    paginationContent.childNodes[paginationIndex].className = "active"
}

const fetchData = (pageNumber) => {
    window.scrollTo(0,0)
    fetch(`https://swapi.dev/api/people?page=${pageNumber}`, { method: "GET", headers: { "Content-Type": "application / json", }, })
        .then((res) => res.json())
        .then((data) => {
            updatePageContent(data.count, 10)
            updatePaginationIndicator()
            disablePaginationNavigationButton()
            starWarzData = data.results;
            starWarzData.map(data =>{
                var randomColor = Math.floor(Math.random()*16777215).toString(16);
                data.color = randomColor;
            })
            console.log(starWarzData)
            updateSearch("")
            cardContainer.innerHTML = ""
            filteredStarWarzData.map(({ name, color }, i) => cardUI(name, color, i))
        }).catch(() => {
            messageUI("wifi_off","An error occurred")
            disablePaginationNavigationButton()
            maxPage = 1;
    })
}
cardUILoader();

searchInput.addEventListener("input", (e) => {
    updateSearch(e.target.value)
    if (filteredStarWarzData.length === 0)  messageUI("search_off","No match");
})

fetchData(paginationIndex);

console.log(cardContainer)
cardContainer.addEventListener("click", (e) => {
    const characterIndex = e.target.role;
    if (!isNaN(characterIndex) && characterIndex !== null){ 
        modal.style.display = "flex"
        const character = filteredStarWarzData[characterIndex];
        modalUI({ ...character })
    }
})

paginationContent.addEventListener("click", (e) => {
    paginationIndex = parseInt(e.target.textContent)
    fetchData(paginationIndex)
})


paginationPrev.addEventListener("click", () => {
    --paginationIndex
    fetchData(paginationIndex);
})

paginationNext.addEventListener("click", () => {
    ++paginationIndex
    fetchData(paginationIndex);
})



modal.addEventListener("click", (e) => (e.target.className.includes("close_icon") || e.target.className === "modal") ? modal.style.display = "none" : null)

