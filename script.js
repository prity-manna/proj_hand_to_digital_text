document.addEventListener("DOMContentLoaded", () => {
  startTextAnimation();
  startImageRotation();
  const contentDiv = document.querySelector(".content");
  const navLinks = document.querySelectorAll(".nav-link");

  let lastPage = sessionStorage.getItem("lastPage") || "/home/";
  loadPage(lastPage);

  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = link.getAttribute("data-page");
      sessionStorage.setItem("lastPage", page);
      loadPage(page);
      updateActiveTab(link);
    });
  });

  function loadPage(page) {
    cleanupPage(); // Remove existing scripts/styles

    fetch(`./pages${page}`)
      .then(response => response.ok ? response.text() : Promise.reject())
      .then(html => renderPage(html, page))
      .catch(() => contentDiv.innerHTML = "<h1>Page not found</h1>");
  }

  function renderPage(html, page) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newContent = doc.querySelector(".content");

    if (!newContent) {
      console.error(`.content div not found in ${page}`);
      return;
    }

    contentDiv.innerHTML = newContent.innerHTML;
    loadAssets(doc);

    if (page === "/home/") {
      loadHomeScript();
    }

    const activeLink = [...navLinks].find(link => link.getAttribute("data-page") === page);
    if (activeLink) updateActiveTab(activeLink);
  }

  function updateActiveTab(activeLink) {
    navLinks.forEach(link => link.classList.remove("current"));
    activeLink.classList.add("current");
  }

  function cleanupPage() {
    document.querySelectorAll("link[data-dynamic-style]").forEach(link => link.remove());
    document.querySelectorAll("script[data-dynamic-script]").forEach(script => script.remove());
    document.querySelectorAll(".particle").forEach(particle => particle.remove());
    document.querySelector("script[data-home-script]")?.remove();
  }

  function loadAssets(doc) {
    loadStyles(Array.from(doc.querySelectorAll("link[rel='stylesheet']")).map(link => link.href));
    loadScripts(Array.from(doc.querySelectorAll("script")).map(script => script.src).filter(src => src));
  }

  function loadStyles(styles) {
    styles.forEach(cssPath => {
      if (!document.querySelector(`link[href="${cssPath}"]`)) {
        const newStyle = document.createElement("link");
        newStyle.rel = "stylesheet";
        newStyle.href = cssPath;
        newStyle.setAttribute("data-dynamic-style", "true");
        document.head.appendChild(newStyle);
      }
    });
  }

  function loadScripts(scripts) {
    scripts.forEach(jsPath => {
      if (!document.querySelector(`script[src="${jsPath}"]`)) {
        const newScript = document.createElement("script");
        newScript.src = jsPath;
        newScript.setAttribute("data-dynamic-script", "true");
        console.log(newScript);
        document.body.appendChild(newScript);
      }
    });
  }

  function loadHomeScript() {
    loadSwiper(() => {
      // Remove old home script if exists
      document.querySelectorAll("script[data-home-script]").forEach(script => script.remove());
    });
  }

  function loadSwiper(callback) {
    if (!document.querySelector(`script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"]`)) {
      const swiperScript = document.createElement("script");
      swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      swiperScript.onload = callback;  // Run home script after Swiper loads
      document.body.appendChild(swiperScript);
    } else {
      callback();
    }
  }
});

function startImageRotation() {
  const images = ["assets/images/image1.jpg", "assets/images/image2.jpg"];
  let imagesIndex = 0;
  const imgElement = document.getElementById("animatedImage");

  function changeImage() {
    setTimeout(() => {
      imgElement.style.transition = "transform 0.3s linear, box-shadow 0.3s ease-in-out, border 0.3s ease-in-out";
      imgElement.style.transform = "rotateY(360deg)";
      imgElement.style.border = "5px solid cyan";
      imgElement.style.boxShadow = "0px 0px 20px cyan";

      setTimeout(() => {
        imagesIndex = (imagesIndex + 1) % images.length;
        imgElement.src = images[imagesIndex];

        imgElement.style.transition = "none";
        imgElement.style.transform = "rotateY(0deg)";
        imgElement.style.border = "5px solid transparent";
        imgElement.style.boxShadow = "none";
      }, 300);
    }, 2000);
  }

  setInterval(changeImage, 2500);
}

function startTextAnimation() {
  const textElement = document.getElementById("text");
  const text = "HAND TO DIGITAL TEXT";
  let index = 0;

  function typeEffect() {
    if (index < text.length) {
      const span = document.createElement("span");
      span.classList.add("letter");
      span.textContent = text[index] === ' ' ? '\u00A0' : text[index];
      textElement.appendChild(span);

      const rect = span.getBoundingClientRect();
      createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
      index++;
      setTimeout(typeEffect, 120);
    } else {
      setTimeout(() => {
        textElement.innerHTML = "";
        index = 0;
        typeEffect();
      }, 5000);
    }
  }

  typeEffect();
}

function createParticle(x, y) {
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    document.body.appendChild(particle);

    const colors = ["#FBDB4A", "#F3934A", "#EB547D", "#9F6AA7", "#5476B3", "#2BB19B", "#70B984", "#FF69B4", "#00FFFF", "#FFD700"];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const size = Math.random() * 20 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 200 + 200;
    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

    particle.style.animation = "explode 2.8s ease-out forwards";
    setTimeout(() => particle.remove(), 2800);
  }
}