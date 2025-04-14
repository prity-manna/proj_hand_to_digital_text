const height = document.querySelector('header').offsetHeight;
document.documentElement.style.setProperty('--header-item-height', (height + 20) + 'px');

document.addEventListener("DOMContentLoaded", () => {
  startOptimizedTextAnimation();
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
    cleanupPage();

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
        document.body.appendChild(newScript);
      }
    });
  }
});

function startImageRotation() {
  const images = ["assets/images/image1.jpg", "assets/images/image2.jpg"];
  let imagesIndex = 0;
  const imgElement = document.getElementById("animatedImage");
  
  if (!imgElement) return;

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

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

function startOptimizedTextAnimation() {
  const textElement = document.getElementById("text");
  if (!textElement) return;
  
  const text = textElement.getAttribute("data-text") || "HAND TO DIGITAL TEXT";
  let isAnimating = false;
  let animationTimeout;
  let particleContainer = null;
  
  function createParticleContainer() {
    if (particleContainer) return;
    
    particleContainer = document.createElement("div");
    particleContainer.className = "particle-container";
    particleContainer.style.position = "fixed";
    particleContainer.style.top = "0";
    particleContainer.style.left = "0";
    particleContainer.style.right = "0";
    particleContainer.style.bottom = "0";
    particleContainer.style.width = "100%";
    particleContainer.style.height = "100%";
    particleContainer.style.pointerEvents = "none";
    particleContainer.style.zIndex = "1000";
    document.body.appendChild(particleContainer);
  }
  
  function clearParticles() {
    if (particleContainer) {
      particleContainer.innerHTML = '';
    }
  }
  
  function typeEffect() {
    if (isAnimating) return;
    isAnimating = true;
    
    createParticleContainer();
    clearParticles();
    textElement.innerHTML = "";
    
    text.split('').forEach((char, index) => {
      const span = document.createElement("span");
      span.classList.add("letter");
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${index * 120}ms`;
      textElement.appendChild(span);
      
      setTimeout(() => {
        const rect = span.getBoundingClientRect();
        createOptimizedParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }, index * 120);
    });
    
    const totalDuration = text.length * 120 + 5000;
    animationTimeout = setTimeout(() => {
      isAnimating = false;
      typeEffect();
    }, totalDuration);
  }
  
  function createOptimizedParticle(x, y) {
    const particleCount = 10;
    const colors = ["#FBDB4A", "#F3934A", "#EB547D", "#9F6AA7", "#5476B3", "#2BB19B", "#70B984", "#FF69B4", "#00FFFF", "#FFD700"];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particleContainer.appendChild(particle);
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
      particle.style.animation = "explode 3s ease-out forwards";
      setTimeout(() => {
        if (particleContainer.contains(particle)) {
          particle.remove();
        }
      }, 2000);
    }
  }

  typeEffect();

  window.addEventListener('beforeunload', () => {
    clearTimeout(animationTimeout);
    if (particleContainer) {
      particleContainer.remove();
    }
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(animationTimeout);
      isAnimating = false;
    } else if (!isAnimating) {
      typeEffect();
    }
  });
}