import countryCardTpl from './templates/country-card.hbs';
import countriesListTmpl from './templates/countries-list.hbs';
import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountryByName} from './fetchCountries.js'

const DEBOUNCE_DELAY = 300;

const refs = {
    countryCardContainer: document.querySelector('.country-info'),
    filterInput: document.querySelector('input'),
    countryList: document.querySelector('.country-list')
};

function renderCountryCard(country) {
    country = country[0];
    country.population = (Number((country.population) / 1000000)).toFixed(2);
    country.languages = Object.values(country.languages).join(',');
    const markup = countryCardTpl(country);
    refs.countryCardContainer.innerHTML = markup;
}

refs.filterInput.addEventListener('input', debounce(onInputAction, DEBOUNCE_DELAY))

function onInputAction(evt) {
    evt.preventDefault;

    fetchCountryByName(evt.target.value.trim())
        .then(resolve => {
            if (resolve.length === 1) {
                refs.countryList.innerHTML = '';
                renderCountryCard(resolve)
            };

            if (resolve.length > 1 && resolve.length < 10) {
                refs.countryCardContainer.innerHTML = '';
                renderCountriesList(resolve)
            };

            if (resolve.length > 10) {
                Notiflix.Notify.warning(`Too many matches found. Please enter a more specific name`)
                // console.log('Too many matches found. Please enter a more specific name');
                refs.countryCardContainer.innerHTML = '';
                refs.countryList.innerHTML = '';
            };

            if (resolve.status === 404) {
                Notiflix.Notify.failure(`Oops, there is no country with that name`)
                // console.log('Oops, there is no country with that name');
                refs.countryCardContainer.innerHTML = '';
                refs.countryList.innerHTML = '';
            }
        })
    .catch(error => {
        console.log(error);
    })
}

function renderCountriesList(countries) {
    const countriesMarkup = countriesListTmpl(countries);
    refs.countryList.innerHTML = countriesMarkup;
}