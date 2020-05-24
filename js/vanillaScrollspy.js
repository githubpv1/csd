function vanillaScrollspy(nav, offset, speed, easing) {

  var menu = document.querySelector(nav);
  var menuHeight;
  if (offset) { //если есть значение селектора
    var head = document.querySelector(offset);

    if (head) { //если есть объект по заданному селектору
      menuHeight = head.clientHeight;
    } else {
      menuHeight = 0;
    }
  } else {
    menuHeight = 0;
  }

  function fncAnimation(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

  window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fncAnimation;
  }();

  function scrollToY(height, speed, easing) {
    var scrollTargetY = height || 0;
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
  };

  function menuControl(menu) {
    var i = void 0;
    var currLink = void 0;
    var refElement = void 0;
    var links = menu.querySelectorAll('a[href^="#"]');
    var scrollPos = window.scrollY || document.documentElement.scrollTop;

    scrollPos += (menuHeight + 2);

    for (i = 0; i < links.length; i += 1) {
      currLink = links[i];
      refElement = document.querySelector(currLink.getAttribute('href'));

      if (refElement.offsetTop <= scrollPos && refElement.offsetTop + refElement.clientHeight > scrollPos) {
        currLink.classList.add('active');
      } else {
        currLink.classList.remove('active');
      }
    }
  };

  function animated(menu, speed, easing) {
    function control(e) {
      e.preventDefault();
      var target = document.querySelector(this.hash);
      scrollToY(target.offsetTop - menuHeight, speed, easing);
    }

    var i = void 0;
    var link = void 0;
    var links = menu.querySelectorAll('a[href^="#"]');

    for (i = 0; i < links.length; i += 1) {
      link = links[i];
      link.addEventListener('click', control);
    }
  };

  animated(menu, speed, easing);
  document.addEventListener('scroll', function () {
    menuControl(menu);
  });
};
