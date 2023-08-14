const input = document.querySelector(".add-Town"),
	form = document.querySelector(".input-container"),
	outputTown = document.querySelector(".sity__name"),
	temperature = document.querySelector(".degree"),
	photoWeather = document.querySelector(".cloud"),
	btnLike = document.querySelector(".like"),
	historyList = document.querySelector(".location-list");

const WebBase = window.localStorage;
let MainBase = [];
memoryRender()

function showWeather(city) {
	try {
		if (!isNaN(city)) {
			alert("Введите текст");
			throw new Error(`${city} это не название города!`);
		}
		const serverUrl = "http://api.openweathermap.org/data/2.5/weather";
		const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
		const url = `${serverUrl}?q=${city}&appid=${apiKey}`;
		fetch(url)
			.then((response) => response.json())
			.then((informWeather) => {
				outputTown.textContent = informWeather.name;
				temperature.textContent = Math.round(informWeather.main.temp - 273.15);
				photoWeather.setAttribute(
					"src",
					`https://openweathermap.org/img/wn/${informWeather.weather[0].icon}@4x.png`
				);
				photoWeather.parentNode.setAttribute(
					"class",
					`container-cloud1`
				);
			});
	} catch (error) {
		console.error(error);
	}
}

form.addEventListener("submit", function(event) {
	event.preventDefault();
	showWeather(input.value)
	event.target.reset();
})

function addLikeCity(degree, name, link) {
	for (let i = 0; i < MainBase.length; i++) {
		if (name === MainBase[i].cityName) {
			return alert("Такой город уже есть в списке из");
		} else continue;
	}
	let cityObj = {
		degree: degree,
		cityName: name,
		Iconlink: link,
	};
	MainBase.push(cityObj);
	WebBase.clear();
	WebBase.setItem("Base", JSON.stringify(MainBase));
	renderhistoryPage();
}

btnLike.addEventListener("click", function (event) {
	addLikeCity(
		temperature.textContent,
		outputTown.textContent,
		photoWeather.src
	);
});

function renderhistoryPage() {
	historyList.innerHTML = "";
	MainBase.forEach((item, i) => {
		historyList.innerHTML += `<li class="location-list__value"><span class="location-list__text">${item.cityName}</span><img class="close__img" src="img/close-icon.svg" alt="close__img"></li>`;
		
	});
	deleteCityPage();
	renderMainPage();
}

function deleteCityPage() {
	closeBTN = document.querySelectorAll(".close__img");
	closeBTN.forEach((item, i) => {
		item.addEventListener("click", (event) => {
			for (let i = 0; i < MainBase.length; i++) {
				if (event.target.parentNode.firstChild.textContent === MainBase[i].cityName) {
					MainBase.splice(i, 1);
					WebBase.clear();
					WebBase.setItem("Base", JSON.stringify(MainBase));
				} else continue;
			}
			renderhistoryPage();
		});
	});
}

function renderMainPage() {
	showOldSity = document.querySelectorAll('.location-list__text');
	showOldSity.forEach((item, i) => {
		item.addEventListener('click', (event) => {
			event.preventDefault();
			showWeather(event.target.textContent)
			
		})
	})
}
function memoryRender() {
	MainBase = JSON.parse(WebBase.getItem('Base'))
	renderhistoryPage()
}
