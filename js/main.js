objectFitImages(); //IE polyfill


// ===== focus ==========

function focusLose() {
	var isMouseDown = false; 
	var button = document.querySelectorAll('a, button');

	for (let i = 0; i < button.length; i++) {
		button[i].addEventListener('mousedown', function () {
			isMouseDown = true;
		});
		button[i].addEventListener('mouseup', function () {
			isMouseDown = false;
		});
		button[i].addEventListener('focus', function () {
			if (isMouseDown) {
				button[i].blur();
			}
		});
	}
}
focusLose();


// ===== vanillajs-scrollspy ==========

vanillaScrollspy('.nav__list', '.head__top', 10000);


// ===== nav ==========

function nav() {
	var nav = document.querySelector('.navi');
	var navList = document.querySelector('.nav__list');
	var lock = document.querySelector('body');
	var navClose = document.querySelector('.nav__close');
	var socials = document.querySelector('.head__socials');

	document.querySelector('.nav__burger').onclick = function () {
		nav.classList.add('active');
		navList.classList.add('active');
		navClose.classList.add('active');
		socials.classList.add('active');
		lock.classList.add('lock');
	}

	navClose.onclick = function () {
		this.classList.remove('active');
		nav.classList.remove('active');
		navList.classList.remove('active');
		socials.classList.remove('active');
		lock.classList.remove('lock');
		regionList.style.display = "none";
	}

	// logo small
	var logo = document.querySelector('.logo');
	
	document.addEventListener('scroll', function () {
		if (window.pageYOffset) {
			logo.classList.add('scroll');
		} else {
			logo.classList.remove('scroll');
		}
	});


	// ====== select city ========

	var city = document.querySelector('[data-city]'),
		// region = document.querySelector('.head__region'),
		region_content = document.querySelector('.region__content'),
		region_city = document.querySelector('.region-content__city'),
		regionList = document.querySelector('.region__list'),
		link = document.querySelectorAll('[data-link]'),
		link_text = document.querySelectorAll('[data-tel_text]'),
		local_city = localStorage.getItem('city');

		
	if (local_city) {
		city.textContent  = local_city;
		region_city.textContent  = local_city;
		var tel = document.querySelector('[value = "'+local_city+'"]').dataset.tel;
		for (let i = 0; i < link.length; i++) {
			link[i].setAttribute('href', 'tel:'+tel);
		}
		for (let i = 0; i < link_text.length; i++) {
			link_text[i] .textContent  = tel;
		}
	}

	document.querySelector('[data-show]').onclick = function () {
		if(window.innerWidth < 768) {
			regionList.style.display = "";
			link[0].style.opacity = "0";
		} else {
			region_content.style.display = "";
		}
	}

	document.querySelector('[data-change]').onclick = function () {
		region_content.style.display = "none";
		regionList.style.display = "";
	}

	document.querySelector('[data-save]').onclick = function () {
		var checkedRadio = document.querySelector('input[name="region"]:checked');
		if (checkedRadio) {
			var checked_city = checkedRadio.value;
			var tel = checkedRadio.dataset.tel;
			for (let i = 0; i < link.length; i++) {
				link[i].setAttribute('href', 'tel:' + tel);
			}
			for (let i = 0; i < link_text.length; i++) {
				link_text[i].textContent = tel;
			}

			region_city.textContent = checked_city;
			city.textContent = checked_city;
			localStorage.setItem('city', checked_city);
			if (window.innerWidth < 768) {
				checkedRadio.checked = false;
			} else {
				region_content.style.display = "";
			}
		}
		regionList.style.display = "none";
		link[0].style.opacity = "1";
	}

	document.querySelector('[data-yes]').onclick = function () {
		var checkedRadio = document.querySelector('input[name="region"]:checked');
		if (checkedRadio) {
			var checked_city = checkedRadio.value;
			city.textContent  = checked_city;
			region_content.style.display = "none";
			checkedRadio.checked = false;
		} else {
			region_content.style.display = "none";
		}

	}
}
nav();


// ====== select text (img) ========

function showText() {
	var elems = document.querySelectorAll('[data-id]');
	for (let i = 0; i < elems.length; i++) {
		elems[i].onclick = function () {
			for (let i = 0; i < elems.length; i++) {
				elems[i].classList.remove('active');
			}
			this.classList.add('active');

			var id = this.getAttribute('data-id');
			var text = document.querySelectorAll('[data-text]');
			for (let i = 0; i < text.length; i++) {
				text[i].classList.remove('show');
			}
			document.querySelector('[data-text="' + id + '"]').classList.add('show');
		}
	}
}
showText();


// ====== Inputmask ========

function maskInput() {

	var tel = document.getElementById('tel');
	Inputmask({
		"mask": "+7(999) 999-9999"
	}).mask(tel);
	var tel2 = document.getElementById('tel2');
	Inputmask({
		"mask": "+7(999) 999-9999"
	}).mask(tel2);

	//email mask

	var email_in = document.getElementById('email');
	var email_in2 = document.getElementById('email2');

	var mailMask = {
		mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
		greedy: false,
		onBeforePaste: function (pastedValue, opts) {
			pastedValue = pastedValue.toLowerCase();
			return pastedValue.replace("mailto:", "");
		},
		definitions: {
			'*': {
				validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
				casing: "lower"
			}
		}
	}

	Inputmask(mailMask).mask(email_in);
	Inputmask(mailMask).mask(email_in2);
}
maskInput();


// ====== validate ========

function valid() {

	var names1 = document.forms['form1']['name'];
	var phone1 = document.forms['form1']['phone'];
	var email1 = document.forms['form1']['email'];

	var names2 = document.forms['form2']['name'];
	var phone2 = document.forms['form2']['phone'];
	var email2 = document.forms['form2']['email'];

	var data = {
		Form2: [names2, phone2, email2],
		Form1: [names1, phone1, email1]
	}

	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			for (let i = 0; i < data[key].length; i++) {
				data[key][i].addEventListener('blur', check);
				data[key][i].addEventListener('focus', rezet);
			}
		}
	}

	function rezet(event) {
		var error = this.nextElementSibling;
		error.innerHTML = '';
		error.classList.remove('error');
		this.classList.remove('invalid');
	}

	function check(event) {
		var error = this.nextElementSibling;

		if (!this.validity.valid) {
			error.classList.add('error');
			error.innerHTML = 'ошибка / неправильный формат';
			this.classList.add('invalid');
		}
		if (this.validity.valueMissing) {
			error.innerHTML = 'ошибка / заполните поле';
		}
	}


	form1.addEventListener('submit', validate);
	form2.addEventListener('submit', validate);

	function validate(event) {
		var nameForm = this.getAttribute('name');
		var checkBox = document.forms[nameForm]['checkbox'];

		if (checkBox.checked) {
			let elem = data[nameForm];

			for (let i = 0; i < elem.length; i++) {
				let input = elem[i];
				let error = input.nextElementSibling;

				if (!input.validity.valid) {
					error.classList.add('error');
					error.innerHTML = 'ошибка / неправильный формат';
					input.classList.add('invalid');
					event.preventDefault();
				}
				if (input.validity.valueMissing) {
					error.innerHTML = 'ошибка / заполните поле';
				}
			}
		} else {
			event.preventDefault();
		}
	}
}
valid();


/* googleMap со стоковым infowindow  ===== */

function initMap() {
			
	var myPos = new google.maps.LatLng(55.7992576, 37.5297314);

	var map = new google.maps.Map(document.getElementById('map'), {
		center: myPos,                //обязатель. Координаты центра
		zoom: 18,                     //обязатель. Зум по умолчанию. Возможные значения от 0 до 21
		disableDefaultUI: true ,    //убирает элементы управления
		//styles: styles_Snazzy      //стилизация цвета если задано
  });	
  
	/* если нужен маркер */
	var marker = new google.maps.Marker({
		position: myPos,              // Координаты расположения маркера.
    map: map,                            // Карта на которую нужно добавить маркер
    //(Необязательно)
		title: "Текст всплывающей подсказки", // Текст выводимый в момент наведения на маркер
		//icon: "img/flash.png" ,            // изображение вместо стандартного маркера
		//animation: google.maps.Animation.DROP // после загрузки карты маркер падает сверху.
	});		

  /* информационное окно с адресом */
	var popupContent = '<div class="map_info"><span>Наш офис</span>'+
	'<p> Электрозаводская 54,<br> БЦ Колибрис  офис. 543</p></div>',
		infowindow = new google.maps.InfoWindow({
		content: popupContent
	});
	
	infowindow.open(map, marker);   //Чтобы информационное окно было видно сразу
	marker.addListener('click', function() {  //вызов окна при клике на маркер 
    infowindow.open(map, marker);
	});
}
//google.maps.event.addDomListener(window, "load", initMap);


//====== swiper we =========

var mySwiper2 = new Swiper('.we__swiper', {
	// spaceBetween: 20,
	loop: true,
	//autoHeight: true,
	grabCursor: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	navigation: {
		nextEl: '.we__next_slide',
		prevEl: '.we__prev_slide',
	},
	pagination: {
		el: '.we__swiper-pagination',
		clickable: true,
	},
	breakpoints: {
		768: {
			// pagination: ' ',
		}
	}
});


//====== swiper team =========

var mySwiper2 = new Swiper('.team__swiper', {
	// spaceBetween: 20,
	loop: true,
	autoHeight: true,
	grabCursor: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	navigation: {
		nextEl: '.team__next_slide',
		prevEl: '.team__prev_slide',
	},
	pagination: {
		el: '.team__swiper-pagination',
		clickable: true,
	},
	breakpoints: {
		768: {
			// pagination: ' ',
		}
	}
});


//====== swiper reviews =========

var mySwiper1 = new Swiper('.reviews__swiper', {
	// spaceBetween: 20,
	loop: true,
	autoHeight: true,
	grabCursor: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	navigation: {
		nextEl: '.reviews__next_slide',
		prevEl: '.reviews__prev_slide',
	},
	pagination: {
		el: '.reviews__swiper-pagination',
		clickable: true,
	},
	breakpoints: {
		768: {
			// pagination: ' ',
		}
	}
});

//====== swiper news =========

if(window.innerWidth < 768) {
	var mySwiper = new Swiper ('.news__swiper', {
		//spaceBetween: 20,
		loop: true,
		grabCursor: true,
		navigation: {
			nextEl: '.news__next_slide',
			prevEl: '.news__prev_slide',
		},
		pagination: {
			el: '.news__swiper_pagination',
			clickable: true,
		}
	});
}


var swipe = document.querySelector('body');

var touchstartY = 0;
var touchendY = 0;

swipe.addEventListener('touchstart', function (event) {
	// touchstartY = event.changedTouches[0].screenY;
	// touchstartY = event.touches[0].screenY;
	
	console.log(touchstartY);
}, false);

swipe.addEventListener('touchend', function (event) {
	// touchendY = event.changedTouches[0].screenY;
	// touchendY = event.touches[0].screenY;
	touchstartY = event.changedTouches[0].screenY;
	
	console.log(touchendY);
  // handleSwipe();
}, false);

// function handleSwipe() {
//   var swiped = 'swiped: ';
//   if (touchendY > touchstartY) {
//     alert(swiped + 'down!');
//   }
// }
