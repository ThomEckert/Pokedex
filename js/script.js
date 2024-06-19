let pokemons = [];
let pokemonNames = [];
let pokemonID;
let iSingle;
let chartNames = ["HP", "Attack", "Defense", "Sp.Atk", "Sp.Def", "Speed"];
let chartStats = [];
let pokemonsOverview = [];
let testOffset = 0;
let maxPokemonOnPage = 20;
let loadingInProgress = false;

async function init() {
  await loadAllPokemons();
  loadOverviewPokemons();
}

/*
|/////////////////////////////////////////////////////////|
|                                                         |
|                                                         |
|-------------------->search function<--------------------|
|                                                         |
|                                                         |
|/////////////////////////////////////////////////////////|
*/

async function searchForPokemons() {
    let searchObject = document.getElementById("pokeSearch").value;
    searchObject = searchObject.toLowerCase();
    let searchLocation = pokemons[0];
    if (searchObject.length >= 3) {
      document.getElementById("pokemonOverview").innerHTML = "";
      pokemonNames = [];
      for (let index = 0; index < searchLocation.length; index++) {
        let element = searchLocation[index];
        let elementName = element.name;
        if (elementName.toLowerCase().includes(searchObject)) {
          pokemonNames.push(element);} }
          await renderOverviewPokemons(pokemonNames);
    } else {pokemonNames = []; 
      await renderOverviewPokemons(pokemonsOverview)};
} 


/*
|///////////////////////////////////////////////////////////|
|                                                           |
|                                                           |
|-------------------->overview pokemons<--------------------|
|                                                           |
|                                                           |
|///////////////////////////////////////////////////////////|
*/
async function loadAllPokemons() {
  let url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025`;
  let response = await fetch(url);
  let responseJSON = await response.json();
  let responseResults = responseJSON.results;
  pokemons.push(responseResults);
}

let lastTwenty = [];

function loadOverviewPokemons() {
  lastTwenty = [];
  for (let index = testOffset; index < maxPokemonOnPage; index++) {
    let element = pokemons[0][index];
    pokemonsOverview.push(element);
    lastTwenty.push(element);
  }
  renderOverviewPokemons(lastTwenty);
}

async function renderOverviewPokemons(responseResults) {
  let pokemonOverview = document.getElementById("pokemonOverview");
  // pokemonOverview.innerHTML = "";
  for (i = 0; i < responseResults.length; i++) {
    let pokemonDatas = responseResults[i];
    let pokemonData = pokemonDatas.url;
    renderOverviewPokemonsIfElse(i, pokemonDatas);
    pokemonOverview.innerHTML += pokemonOverviewHTML(i, responseResults, index);
    await loadPokemon(pokemonData);
    let loadetPokemonTypes = currentPokemon["types"];
    document.getElementById(`pokemonType[${i}]`).innerHTML = "";
    pokemonColor(i, loadetPokemonTypes);
  }
}

function renderOverviewPokemonsIfElse(i, pokemonDatas) {
  if (pokemonNames.length === 0) {
    index = i;
  } else {
    index = pokemons[0].findIndex(
      (pokemons) => pokemons.name === pokemonDatas.name
    );
  }
}

function pokemonColor(i, loadetPokemonTypes) {
  for (let j = 0; j < loadetPokemonTypes.length; j++) {
    const pokeTypes = loadetPokemonTypes[j];
    document.getElementById(`pokemonType[${i}]`).innerHTML += `
            <span class="pokemon-type-text" id="pokemonColor${[i, j]}">${pokeTypes.type.name}</span>
        `;
    whichColor(i);
  }
}

function whichColor(i) {
  let typeID = document.getElementById(`pokemonColor${i},0`).innerText;
  document.getElementById(`overview${pokemonID}`).classList.add(`${typeID}`);
}

async function loadPokemon(data) {
  let url = data;
  let response = await fetch(url);
  currentPokemon = await response.json();
}

function morePokemons() {
  if (!loadingInProgress) {
  loadingInProgress = true;
  maxPokemonOnPage = maxPokemonOnPage + 20;
  testOffset = testOffset + 20;
  loadOverviewPokemons();
  loadingInProgress = false;
  }
}

function pokemonOverviewHTML(i, responseResults, index) {
  pokemonID = responseResults[i].url.split("/")[6];
  return /*html*/ `
    <div class="pokemonOverview">
        <div class="overview">
            <div class="type-color" id="overview${pokemonID}" onclick="detailLook(${pokemonID})">
                <div class="overview-headline">
                    <h3>${responseResults[i].name}</h3>
                    <span><b>#${index + 1}</b></span>
                </div>
                <div class="overview-box">
                    <div class="pokemon-type" id="pokemonType[${i}]">
                        <div class="pokemon-type-text" id="typeColor${i}"></div>
                    </div>
                    <div id="pokemonID[${i}]" class="img-box">
                        <img class="pokemon-image" 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          index + 1
                        }.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>    
    `;
}

/*
|////////////////////////////////////////////////////////|
|                                                        |
|                                                        |
|-------------------->single pokemon<--------------------|
|                                                        |
|                                                        |
|////////////////////////////////////////////////////////|
*/
async function detailLook(iSingle) {
  document.getElementById("pokedex").classList.remove("d-none");
  document.getElementById("chartDiv").classList.remove("d-none");
  document.getElementById("singlePokemon").classList.add("fixed");
  await loadSinglePokemon(iSingle);
  renderChart();
  hiddenScrollbar("add");
}

function hiddenScrollbar(addRemove) {
  if (addRemove == "add") {
    document.body.classList.add("scrollbar-death");
  } else {
    document.body.classList.remove("scrollbar-death");
  }
}

async function closeDetailLook() {
  document.getElementById("pokedex").classList.add("d-none");
  document.getElementById("chartDiv").classList.add("d-none");
  document.getElementById("singlePokemon").classList.remove("fixed");
  destroyChart();
  SingleColor("remove");
  hiddenScrollbar("remove");
}

async function loadSinglePokemon(iSingle) {
  let urlSingle = `https://pokeapi.co/api/v2/pokemon/${iSingle}`;
  let responseSingle = await fetch(urlSingle);
  let responseSingleResult = await responseSingle.json();
  renderPokemonInfo(iSingle, responseSingleResult);
  getStats(responseSingleResult);
  SingleColor("add");
}

async function renderPokemonInfo(iSingle, responseSingleResult) {
  headerPokemonInfo(responseSingleResult);
  typesPokemonInfo(iSingle, responseSingleResult);
  arrowPokemonInfo(iSingle);
  imagePokemonInfo(iSingle);
}

function arrowPokemonInfo(iSingle) {
  let left = document.getElementById("leftButton");
  left.innerHTML = `<img id="leftButtonIMG" src="./img/left.png" alt="" onclick="previousPokemon(${iSingle})">`;
  let right = document.getElementById("rightButton");
  right.innerHTML = `<img id="rightButtonIMG" src="./img/right.png" alt="" onclick="nextPokemon(${iSingle})">`;
}

function typesPokemonInfo(iSingle, responseSingleResult) {
  let singleTypes = responseSingleResult[`types`];
  document.getElementById("pokemonType").innerHTML = "";
  for (let typeCounter = 0; typeCounter < singleTypes.length; typeCounter++) {
    const element = singleTypes[typeCounter];
    document.getElementById("pokemonType").innerHTML += typesPokemonInfoHTML(iSingle,typeCounter,element);
  }
}

function typesPokemonInfoHTML(iSingle, typeCounter, element) {
  return /*html*/ `
  <span class="pokemon-type-text" id="type[${(iSingle, typeCounter)}]">${
    element.type.name
  }</span>
  `;
}

function imagePokemonInfo(iSingle) {
  document.getElementById("pokemonImage").innerHTML = /*html*/ `
    <img class="pokemon-img" src="${`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${iSingle}.png`}">`;
}

function headerPokemonInfo(responseSingleResult) {
  document.getElementById("pokemonName").innerHTML =
    responseSingleResult[`name`];
  document.getElementById("pokemonID").innerHTML = responseSingleResult[`id`];
}

function SingleColor(addRemove) {
  let typeID = document.getElementById("type[0]").innerText;
  if (addRemove == "add") {
    document.getElementById("singleTypeColor").classList.add(`${typeID}`);
  } else {
    document.getElementById("singleTypeColor").classList.remove(`${typeID}`);
  }
}

function getStats(responseSingleResult) {
  let pokemonData = responseSingleResult["stats"];
  chartStats = [];
  for (let i = 0; i < chartNames.length; i++) {
    let value = pokemonData[i].base_stat;
    chartStats.push(value);
  }
}

 async function nextPokemon(iSingle) {
  if (!loadingInProgress) {
    loadingInProgress = true;
    console.log(loadingInProgress);
    if (iSingle < 1024) {
      let result = iSingle + 1;
      iSingle = result;
    } else {
      iSingle = 1;
    }
    await closeDetailLook();
    await detailLook(iSingle);
    loadingInProgress = false;
    console.log(loadingInProgress);
  }
}

function previousPokemon(iSingle) {
  if (!loadingInProgress) {
    loadingInProgress = true;
    if (iSingle >= 2) {
      let result = iSingle - 1;
      iSingle = result;
    } else {
      iSingle = 1025;
    }
    closeDetailLook();
    detailLook(iSingle);
    loadingInProgress = false;
  }
}