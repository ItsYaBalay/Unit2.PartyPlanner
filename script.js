const COHORT = "2405-ftb-et-web-ft";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");

const render = async () => {
  await getParties();
  renderParties();
};

const getParties = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error.message);
  }
};

const renderParties = () => {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties</li>";
    return;
  }
  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${party.name}</h2>
        <h3>When:${party.date}</h3>
        <h3>Where:${party.location}</h3>
        <p>${party.description}</p>
        <button onclick="deleteParty('${party.id}')">Delete</button>
        `;
    return li;
  });
  partyList.replaceChildren(...partyCards);
};

const addParty = async (event) => {
  event.preventDefault();
  console.log(`${addPartyForm.date.value}T${addPartyForm.time.value}:00.000Z`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: `${addPartyForm.date.value}T${addPartyForm.time.value}:00.000Z`,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }
    render();
  } catch (error) {
    console.log(error.message);
  }
};

const deleteParty = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error.message);
  }
  render();
};

addPartyForm.addEventListener("submit", addParty);

render();
