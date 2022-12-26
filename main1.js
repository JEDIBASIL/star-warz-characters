fetch("https://swapi.dev/api/people")
  .then((response) => {
    return response.json();
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
