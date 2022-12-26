fetch("https://swapi.dev/api/people")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("ERROR");
    }
  })
  .then((data) => {
    console.log(data);
    data.forEach((user) => {
      let html = "";
      const htmlDisplay = `<div>
      <h2>${user.name}</h2>
      <h3>${user.height}</h3>
      <h3>${user.gender}</h3>
      </div>`;
      html += htmlDisplay;
      let container = document.querySelector("#container");
      container.innerHTML = html;
    });
  })
  .catch((error) => console.error("SERVER ERROR", error));

// function displayContent() {
//   let people = await getApiData();
//   let html = "";

//   people.forEach((person) => {
//     let htmlDisplay = ` <div>
//       <h2>${person.name}</h2>
//       <h3>${person.height}</h3>
//       <h3>${person.gender}</h3>
//     <ul>
//     <li>${person.films[0]}</li>
//     </ul>
//       </div>
//       `;
//     html += htmlDisplay;
//   });
//   let container = document.getElementById("container");
//   container.innerHTML = html;
// }

// displayContent();

// function displayContent(data) {
//   let html = "";
//   data.forEach((person) => {
//     let htmlDisplay = `<div>
//     <img src = "vim_1.png" alt = "sample image">
//     <h2>${person.name}</h2>
//     </div>`;
//     html += htmlDisplay;
//   });
//   let container = document.getElementById("container");
//   container.innerHTML = html;
//   return;
// }
