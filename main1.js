fetch(`https://swapi.dev/api/people/${id}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    const name = data.name;
    const height = data.height;
    const gender = data.gender;
    const html = `
      <div class = "character">
        <div class = "name">
          <h2>${name}</h2>
        </div>
        <div class = "other_info">
          <h3>${name}</h3>
          <h3>${gender}</h3>
          <h3>${height}</h3>
        </div>
      </div>
    `;
    document.querySelector("#container").insertAdjacentHTML("afterbegin", html);
  })
  .catch((error) => console.error("SERVER ERROR", error));
