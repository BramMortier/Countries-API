const optionsMenuBtn = document.getElementById('filter-menu');
const optionsMenuList = document.getElementById('filter-list');

const results = document.getElementById('search-results');
const searchBar = document.getElementById('search-input');

const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeText = document.querySelector('.dark-mode-text');
const darkModeIcon = document.getElementById('dark-mode-icon');
const html = document.querySelector('html');

const mainPage = document.getElementById('main-page');
const detailPage = document.querySelector('.detail-page');
let darkModeOn = false;

const filterBtn = document.getElementById('filter');
const listOptions = Array.from(document.querySelectorAll('.option'));

listOptions.map(option => {
  option.addEventListener('click', () => {
    results.innerHTML = '';
    loadCountriesByRegion(option.innerHTML);
    filterBtn.innerHTML = `
      <h2 class="filter-text">${option.innerHTML}</h2>
      <i class="fas fa-chevron-down"></i>
    `
  });
});

optionsMenuBtn.addEventListener('click', () => {
  optionsMenuList.classList.toggle('filter-menu-open');
});

darkModeToggle.addEventListener('click', () => {
  if(darkModeOn == false){
    darkModeIcon.classList.remove('far');
    darkModeIcon.classList.add('fas');
    darkModeText.innerHTML = 'Light Mode'
    html.dataset.darkmode = 'on';
    darkModeOn = true;
  } else {
    darkModeIcon.classList.add('far');
    darkModeIcon.classList.remove('fas');
    darkModeText.innerHTML = 'Dark Mode'
    html.dataset.darkmode = 'off';
    darkModeOn = false;
  }
});

searchBar.addEventListener('input', () => {
  const currentValue =  searchBar.value;
  if(currentValue == ''){
    results.innerHTML = '';
    loadAllCountries();
  } else {
    results.innerHTML = '';
    loadCountriesByName(currentValue);  
  }
});

function updateActiveCards(){
  activeCards = Array.from(document.querySelectorAll('.search-result-card'));
  activeCards.forEach(card => {
    card.addEventListener('click', () => {
      mainPage.classList.add('main-page-inactive');
      detailPage.classList.add('detail-page-active');
      let cardContent = card.innerHTML;
      let countryName = cardContent.match(/<h2>\w+/g).toString(2).slice(4);
      getDetailPageInfo(countryName);
    });
  });
}

function updateDetailPageInfo(data){
  const population = data[0].population.toLocaleString();
  const currenciesArray = [];
  const languagesArray = [];

  data[0].currencies.map(currency => {
    currenciesArray.push(currency.name);
  });

  data[0].languages.map(language => {
    languagesArray.push(language.name);
  });

  detailPage.innerHTML = `
    <section>
      <button class="exit-detail-page-btn"><i class="fas fa-arrow-left"></i>Back</button>
      <div class="detail-page-main flex">
        <div class="flag-container flex">
          <img src=${data[0].flag} alt="">
        </div>
        <div class="detail-info-container flex">
          <h2>${data[0].name}</h2>
          <div class="detail-info flex">
            <div class="col-1">
              <h3>Native name: <span>${data[0].nativeName}</span></h3>
              <h3>Population: <span>${population}</span></h3>
              <h3>Region: <span>${data[0].region}</span></h3>
              <h3>Sub Region: <span>${data[0].subregion}</span></h3>
              <h3>Capital: <span>${data[0].capital}</span></h3>
            </div>
            <div class="col-2">
              <h3>Top Level Domain: <span>${data[0].topLevelDomain}</span></h3>
              <h3>Currencies: <span>${currenciesArray.join(' ')}</span></h3>
              <h3>Languages: <span>${languagesArray.join(' ')}</span></h3>
            </div>
          </div>
          <h3>Border Countries: </h3>
          <div class="border-countries-container flex" id="border-countries"></div>
        </div>
      </div>
    </section>
  `
  const borderCountriesContainer = document.getElementById('border-countries');
  data[0].borders.map(country => {
    addBorderCountry(country, borderCountriesContainer);
  });

  const borderCountries = Array.from(document.querySelectorAll('.border-country'));
  borderCountries.map(country => {
    country.addEventListener('click', () => {
      loadCountryByCode(country.innerHTML.toLocaleLowerCase());
    });
  });

  const closeDetailPageBtn = document.querySelector('.exit-detail-page-btn');
  closeDetailPageBtn.addEventListener('click', () => {
    mainPage.classList.remove('main-page-inactive');
    detailPage.innerHTML = '';
  });
}

function addBorderCountry(country, container){
  const newBorderCountry = document.createElement('button');
  newBorderCountry.classList.add('border-country');
  newBorderCountry.innerHTML = `${country}`
  container.append(newBorderCountry);
}

async function getDetailPageInfo(countryName){
  const response = await fetch('https://restcountries.com/v2/name/' + countryName);
  const data = await response.json();
  updateDetailPageInfo(data);
}

async function loadCountriesByRegion(region){
  const response = await fetch('https://restcountries.com/v3.1/region/' + region);
  const data = await response.json();
  if(data.length !== 0){
    data.map(element => {
      addCountry(element);
    });
    updateActiveCards();
  }
}

async function loadCountriesByName(name){
  const respone = await fetch('https://restcountries.com/v2/name/' + name);
  const data = await respone.json();
  if(data.length !== 0){
    data.map(element => {
      addCountry(element);
    });
    updateActiveCards();
  }
}

async function loadAllCountries(){
  const response = await fetch('https://restcountries.com/v2/all');
  const data = await response.json();
  data.map(element => {
    addCountry(element);
  });
  updateActiveCards();
}

async function loadCountryByCode(code){
  const response = await fetch('https://restcountries.com/v2/alpha/' + code);
  const data = [await response.json()];
  updateDetailPageInfo(data);
}

function addCountry(CountryData){
  const newCard = document.createElement('div');
  const population = CountryData.population.toLocaleString();
  let countryName = CountryData.name.common;
  if(countryName == undefined){
    countryName = CountryData.name;
  }
  newCard.classList.add('search-result-card');
  newCard.innerHTML = `
    <div class="country-img">
      <img src="${CountryData.flags.svg}" alt="">
    </div>
    <div class="country-info">
      <h2>${countryName}</h2>
      <h3>Population: <span>${population}</span></h3>
      <h3>Region: <span>${CountryData.region}</span></h3>
      <h3>Capital: <span>${CountryData.capital}</span></h3>
    </div>
  `
  results.append(newCard);
}

loadAllCountries()