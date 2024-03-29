"use strict";

objectFitImages();

// ===== webp =====

(function () {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
})();

//сбрасываем :focus

(function () {
  var button = document.querySelectorAll('a, button, label, input');
  var isMouseDown = false;
  for (var i = 0; i < button.length; i++) {
    var el = button[i];
    if (el.tagName !== 'LABEL') {
      el.classList.add('focus');
    }
    el.addEventListener('mousedown', function () {
      this.classList.remove('focus');
      isMouseDown = true;
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === "Tab") {
        isMouseDown = false;
      }
    });
    el.addEventListener('focus', function () {
      if (isMouseDown) {
        this.classList.remove('focus');
      }
    });
    el.addEventListener('blur', function () {
      this.classList.add('focus');
    });
  }
})();

// ===== vanillajs-scrollspy ==========

function scrollMenu(nav, offset, speed, easing) {
  var menu = document.querySelector(nav);
  var menuHeight;
  if (offset) {
    var head = document.querySelector(offset);
    if (head) {
      menuHeight = head.clientHeight;
      // отступ под меню
      // document.body.style.paddingTop = menuHeight + 'px';
    } else {
      menuHeight = 0;
    }
  } else {
    menuHeight = 0;
  }
  function fncAnimation(callback) {
    window.setTimeout(callback, 1000 / 60);
  }
  ;
  window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fncAnimation;
  }();
  function scrollToY(height, speed, easing) {
    var scrollTargetY = height || 0;
    scrollTargetY += 2;
    var speed = speed || 2000;
    var easing = easing || 'easeOutSine';
    var scrollY = window.pageYOffset;
    var currentTime = 0;
    var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));
    var easingEquations = {
      easeOutSine: function easeOutSine(pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function easeInOutSine(pos) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1);
      },
      easeInOutQuint: function easeInOutQuint(pos) {
        /* eslint-disable-next-line */
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow(pos - 2, 5) + 2);
      }
    };
    function tick() {
      currentTime += 1 / 60;
      var p = currentTime / time;
      var t = easingEquations[easing](p);
      if (p < 1) {
        window.requestAnimFrame(tick);
        window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
      } else {
        window.scrollTo(0, scrollTargetY);
      }
    }
    tick();
  }
  ;
  function menuControl(menu) {
    var i = void 0;
    var currLink = void 0;
    var refElement = void 0;
    var links = menu.querySelectorAll('a[href^="#"]');
    var scrollY = window.pageYOffset;
    for (i = 0; i < links.length; i += 1) {
      currLink = links[i];
      refElement = document.querySelector(currLink.getAttribute('href'));
      if (refElement) {
        var box = refElement.getBoundingClientRect();
        var topElem = box.top + scrollY - menuHeight;
        if (topElem <= scrollY && topElem + refElement.clientHeight > scrollY) {
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    }
  }
  function animated(menu, speed, easing) {
    function control(e) {
      e.preventDefault();
      if (head) {
        menuHeight = head.clientHeight;
      } else {
        menuHeight = 0;
      }
      var elem = document.querySelector(this.hash);
      if (elem) {
        var box = elem.getBoundingClientRect();
        var topElem = box.top + window.pageYOffset;
        scrollToY(topElem - menuHeight, speed, easing);
      }
    }
    var i = void 0;
    var link = void 0;
    var links = menu.querySelectorAll('a[href^="#"]');
    for (i = 0; i < links.length; i += 1) {
      link = links[i];
      link.addEventListener('click', control);
    }
  }
  animated(menu, speed, easing);
  document.addEventListener('scroll', function () {
    menuControl(menu);
  });
}
scrollMenu('.nav__list', '.head__top', 10000);

// ===== nav ==========

function nav() {
  var nav = document.querySelector('.navi');
  var navList = document.querySelector('.nav__list');
  var lock = document.querySelector('body');
  var navClose = document.querySelector('.nav__close');
  var socials = document.querySelector('.head__socials');
  var burger = document.querySelector('.nav__burger');
  burger.addEventListener('click', open);
  function open() {
    nav.classList.add('active');
    navList.classList.add('active');
    lock.classList.add('lock');
    navClose.classList.add('active');
    if (socials) {
      socials.classList.add('active');
    }
  }
  function close() {
    nav.classList.remove('active');
    navList.classList.remove('active');
    lock.classList.remove('lock');
    navClose.classList.remove('active');
    regionList.style.display = "none";
    if (socials) {
      socials.classList.remove('active');
    }
  }
  navClose.addEventListener('click', close);
  var links = navList.querySelectorAll('a[href^="#"]');
  for (i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', close);
  }

  // ===== swipe =====

  function swipe(elem) {
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendX = 0;
    var touchendY = 0;
    var minDist = 10; // px
    // var maxDist = 120;
    var startTime = 0;
    var endTime = 0;
    var minSpeed = 1.0;
    elem.addEventListener('touchstart', touchstart, {
      passive: true
    });
    elem.addEventListener('touchend', touchend);
    function touchstart(event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
      startTime = new Date().getTime();
    }
    function touchend(event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      endTime = new Date().getTime();
      getDirection();
    }
    function getDirection() {
      var dx = touchendX - touchstartX;
      var dy = touchendY - touchstartY;
      var abs_dx = Math.abs(dx);
      var abs_dy = Math.abs(dy);
      var time = endTime - startTime;
      var speedX = abs_dx / time;
      var speedY = abs_dy / time;
      if (speedX > minSpeed || speedY > minSpeed) {
        if (abs_dx > minDist && abs_dx > abs_dy) {
          if (dx < 0) {
            elem.dispatchEvent(new CustomEvent("onSwipeLeft"));
          } else {
            elem.dispatchEvent(new CustomEvent("onSwipeRight"));
          }
        }
        if (abs_dy > minDist && abs_dy > abs_dx) {
          if (dy < 0) {
            elem.dispatchEvent(new CustomEvent("onSwipeUp"));
          } else {
            elem.dispatchEvent(new CustomEvent("onSwipeDown"));
          }
        }
      }
    }
  }
  swipe(nav);
  nav.addEventListener("onSwipeUp", close);

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
    city.textContent = local_city;
    region_city.textContent = local_city;
    var tel = document.querySelector('[value = "' + local_city + '"]').dataset.tel;
    for (var i = 0; i < link.length; i++) {
      link[i].setAttribute('href', 'tel:' + tel);
    }
    for (var i = 0; i < link_text.length; i++) {
      link_text[i].textContent = tel;
    }
  }
  document.querySelector('[data-show]').onclick = function () {
    if (window.innerWidth < 768) {
      regionList.style.display = "";
      link[0].style.opacity = "0";
    } else {
      region_content.style.display = "";
    }
  };
  document.querySelector('[data-change]').onclick = function () {
    region_content.style.display = "none";
    regionList.style.display = "";
  };
  document.querySelector('[data-save]').onclick = function () {
    var checkedRadio = document.querySelector('input[name="region"]:checked');
    if (checkedRadio) {
      var checked_city = checkedRadio.value;
      var tel = checkedRadio.dataset.tel;
      for (var i = 0; i < link.length; i++) {
        link[i].setAttribute('href', 'tel:' + tel);
      }
      for (var i = 0; i < link_text.length; i++) {
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
  };
  document.querySelector('[data-yes]').onclick = function () {
    var checkedRadio = document.querySelector('input[name="region"]:checked');
    if (checkedRadio) {
      var checked_city = checkedRadio.value;
      city.textContent = checked_city;
      region_content.style.display = "none";
      checkedRadio.checked = false;
    } else {
      region_content.style.display = "none";
    }
  };
}
nav();

// ====== select slide text (img) ========

function showText() {
  var elems = document.querySelectorAll('[data-id]');
  for (var i = 0; i < elems.length; i++) {
    elems[i].onclick = function () {
      for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove('active');
      }
      this.classList.add('active');
      var id = this.getAttribute('data-id');
      var text = document.querySelectorAll('[data-text]');
      for (var i = 0; i < text.length; i++) {
        var el = text[i];
        slideUp.call(el);
      }
      setTimeout(function () {
        var elem = document.querySelector('[data-text="' + id + '"]');
        slideDown.call(elem);
      }, 540);
    };
  }
  function slideDown() {
    if (this.style.display == 'none' || getComputedStyle(this).display == 'none') {
      this.style.overflow = 'hidden';
      this.style.display = 'block';
      var height = this.offsetHeight;
      this.style.height = '0px';
      setTimeout(function (elem) {
        elem.style.height = height + 'px';
      }, 20, this);
    }
  }
  function slideUp() {
    if (!(this.style.display == 'none' || getComputedStyle(this).display == 'none')) {
      this.style.overflow = 'hidden';
      var height = this.offsetHeight;
      this.style.height = height + 'px';
      setTimeout(function (elem) {
        elem.style.height = '0px';
      }, 20, this);
      setTimeout(function (elem) {
        elem.style.display = 'none';
        elem.style.height = '';
      }, 540, this);
    }
  }
}
showText();

// ====== Inputmask ========

function maskInput() {
  var tel = document.getElementById('tel');
  if (tel) {
    Inputmask({
      "mask": "+7(999) 999-9999"
    }).mask(tel);
  }
  var tel2 = document.getElementById('tel2');
  if (tel2) {
    Inputmask({
      "mask": "+7(999) 999-9999"
    }).mask(tel2);
  }

  //email mask

  var email_in = document.getElementById('email');
  var email_in2 = document.getElementById('email2');
  var mailMask = {
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    greedy: false,
    onBeforePaste: function onBeforePaste(pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace("mailto:", "");
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
        casing: "lower"
      }
    }
  };
  if (email_in) {
    Inputmask(mailMask).mask(email_in);
  }
  if (email_in2) {
    Inputmask(mailMask).mask(email_in2);
  }
}
maskInput();

// ====== validate and send form ========

(function () {
  var reg = document.querySelectorAll('[required]');
  var select = document.querySelectorAll('.select-custom__btn');
  if (select) {
    for (var i = 0; i < select.length; i++) {
      select[i].addEventListener('click', rezetSelect);
    }
  }
  function rezetSelect() {
    this.classList.remove('invalid');
    var formItem = this.closest('.form__item');
    var select = formItem.querySelector('select');
    select.classList.remove('invalid');
    removeError.call(this);
  }
  function removeError() {
    var error = this.closest('.form__item').querySelector('.error');
    if (error) {
      error.classList.remove('active');
      error.addEventListener('transitionend', function () {
        if (!this.classList.contains('active')) {
          error.innerHTML = '';
        }
      });
    }
  }
  if (reg) {
    for (var i = 0; i < reg.length; i++) {
      reg[i].addEventListener('blur', check);
      reg[i].addEventListener('focus', rezet);
    }
  }
  function rezet() {
    var formItem = this.closest('.form__item');
    this.classList.remove('invalid');
    removeError.call(this);
    if (this.tagName == 'SELECT') {
      var selectCustomBtn = formItem.querySelector('.select-custom__btn');
      if (selectCustomBtn) {
        selectCustomBtn.classList.remove('invalid');
      }
      removeError.call(this);
    }
  }
  function check() {
    var formItem = this.closest('.form__item');
    var error = formItem.querySelector('.error');
    if (!this.validity.valid) {
      this.classList.add('invalid');
      if (error) {
        error.classList.add('active');
        error.innerHTML = 'ошибка / неправильный формат';
        // error.innerHTML = 'error / wrong format';

        if (this.validity.valueMissing || this.value === '') {
          error.innerHTML = 'ошибка / заполните поле';
          // error.innerHTML = 'error / fill in the field';
        }
      }

      if (this.tagName == 'SELECT') {
        var selectCustomBtn = formItem.querySelector('.select-custom__btn');
        if (selectCustomBtn) {
          selectCustomBtn.classList.add('invalid');
        }
        if (error) {
          error.classList.add('active');
          error.innerHTML = 'ошибка / сделайте выбор';
          // error.innerHTML = 'error / make a choice';
        }
      }

      return 1;
    } else {
      return 0;
    }
  }

  // rating-star

  var ratingAll = document.querySelectorAll('[data-rating]');
  if (ratingAll) {
    for (var i = 0; i < ratingAll.length; i++) {
      var input = ratingAll[i].querySelectorAll('input');
      for (var i = 0; i < input.length; i++) {
        input[i].addEventListener('focus', rezetRating);
      }
    }
  }
  function rezetRating() {
    var rating = this.closest('[data-rating]');
    rating.classList.remove('invalid');
    removeError.call(this);
  }
  function checkSendRating() {
    var error = this.closest('.form__item').querySelector('.error');
    var input = this.querySelector('[name="rating"]');
    if (input.checked) {
      this.classList.add('invalid');
      if (error) {
        error.classList.add('active');
        error.innerHTML = 'ошибка / сделайте выбор';
      }
      return 1;
    } else {
      return 0;
    }
  }
  // end rating-star

  var messageBoxId;
  function validate(e) {
    var test = this.hasAttribute('data-test');
    messageBoxId = this.getAttribute('data-message');
    var rating = this.querySelector('[data-rating]');
    var reg = this.querySelectorAll('[required]');
    var agree = this.querySelector('input[name="agree"]');
    var countError = 0;
    if (!agree || agree.checked) {
      if (rating) {
        countError += checkSendRating.call(rating);
      }
      for (var i = 0; i < reg.length; i++) {
        countError += check.call(reg[i]);
        if (countError) {
          e.preventDefault();
        }
      }
    } else {
      e.preventDefault();
      countError++;
    }
    if (test && countError === 0) {
      e.preventDefault();
      countError++;
      this.reset();
      setDate.call(this, 'test');
    }
    return countError;
  }

  // ===== submit ===== 

  var form = document.querySelectorAll('form');
  if (form) {
    for (var i = 0; i < form.length; i++) {
      form[i].addEventListener('submit', ajaxSend);
    }
  }
  function ajaxSend(e) {
    e.preventDefault();
    var el = this;
    var error = validate.call(el, e);
    if (error === 0) {
      this.classList.add('_sending', 'show');
      var formData = new FormData(this);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", this.getAttribute('action'));
      xhr.send(formData);
      xhr.onloadend = function () {
        if (this.status == 200) {
          el.reset();
          var select = el.querySelector('select');
          if (select) {
            select.options[0].selected = 'selected';
            select.dispatchEvent(new Event('change'));
          }
          el.classList.remove('show');
          setDate.call(el, xhr.response);
        } else {
          alert('Ошибка' + this.status);
          // console.log('Ошибка' + this.status);
          el.classList.remove('show');
        }
      };
    }
  }

  // вывод ответа сервера в popup

  function setDate(data) {
    if (messageBoxId) {
      var messageBox = document.querySelector('#dialog-' + messageBoxId);
      var parent = this.closest('.dialog-backdrop');
      if (messageBox) {
        var messageText = messageBox.querySelector('[data-message-text]');
        if (messageText) {
          messageText.textContent = data;
        }
        if (parent) {
          window.replaceDialog('dialog-' + messageBoxId);
          // window.openDialog('dialog-' + messageBoxId, this);
        } else {
          window.openDialog('dialog-' + messageBoxId, this);
        }
      }
    }
  }
})();

/* ==== googleMap со стоковым infowindow  ===== */

function initMap() {
  var myPos = new google.maps.LatLng(68.970665, 33.07497);
  var elem = document.getElementById('map');
  if (elem) {
    var map = new google.maps.Map(elem, {
      center: myPos,
      //обязатель. Координаты центра
      zoom: 15,
      //обязатель. Зум по умолчанию. Возможные значения от 0 до 21
      disableDefaultUI: true //убирает элементы управления
      //styles: styles_Snazzy      //стилизация цвета если задано
    });
  }
  /* если нужен маркер */
  var marker = new google.maps.Marker({
    position: myPos,
    // Координаты расположения маркера.
    map: map,
    // Карта на которую нужно добавить маркер
    //(Необязательно)
    title: "Текст всплывающей подсказки" // Текст выводимый в момент наведения на маркер
    //icon: "img/flash.png" ,            // изображение вместо стандартного маркера
    //animation: google.maps.Animation.DROP // после загрузки карты маркер падает сверху.
  });

  /* информационное окно с адресом */
  var popupContent = '<div class="map_info"><span>Наш офис</span>' + '<p> Коминтерна ул., 5 д., 208 оф.<br> Мурманск г., Мурманская обл. </p></div>',
    infowindow = new google.maps.InfoWindow({
      content: popupContent
    });
  infowindow.open(map, marker); //Чтобы информационное окно было видно сразу
  marker.addListener('click', function () {
    //вызов окна при клике на маркер 
    infowindow.open(map, marker);
  });
}
google.maps.event.addDomListener(window, "load", initMap);

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
    prevEl: '.we__prev_slide'
  },
  pagination: {
    el: '.we__swiper-pagination',
    clickable: true
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
    prevEl: '.team__prev_slide'
  },
  pagination: {
    el: '.team__swiper-pagination',
    clickable: true
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
    prevEl: '.reviews__prev_slide'
  },
  pagination: {
    el: '.reviews__swiper-pagination',
    clickable: true
  },
  breakpoints: {
    768: {
      // pagination: ' ',
    }
  }
});

//====== swiper news =========

if (window.innerWidth < 768) {
  var mySwiper = new Swiper('.news__swiper', {
    //spaceBetween: 20,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.news__next_slide',
      prevEl: '.news__prev_slide'
    },
    pagination: {
      el: '.news__swiper_pagination',
      clickable: true
    }
  });
}

//====== swiper article =========

var mySwiper = new Swiper('.art__swiper', {
  loop: true,
  //autoHeight: true,
  direction: 'vertical',
  spaceBetween: 20,
  slidesPerView: 2,
  // slidesPerColumn: 2,
  grabCursor: true,
  navigation: {
    nextEl: '.art__next_slide',
    prevEl: '.art__prev_slide'
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerColumn: 1,
      direction: 'horizontal'
    }
  }
});

//====== swiper article =========

if (window.innerWidth < 768) {
  var mySwiper = new Swiper('.art-news__swiper', {
    //spaceBetween: 20,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.art-news__next_slide',
      prevEl: '.art-news__prev_slide'
    },
    pagination: {
      el: '.art-news__swiper_pagination',
      clickable: true
    }
  });
}