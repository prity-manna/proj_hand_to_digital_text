// Ensure the script only runs once per page load
if (document.getElementById("animatedImage")) {

    const swiper = new Swiper('.slider-wrapper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
      
        autoplay: {
          delay: 3000, // Auto-slide every 3 seconds
          disableOnInteraction: false, // Keeps autoplay running after user interaction
        },
      
        // Pagination bullets
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // Responsive breakpoints
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          }
        }
      });
      

  const images = ["assets/images/image1.jpg", "assets/images/image2.jpg"];
  let imagesIndex = 0;
  const imgElement = document.getElementById("animatedImage");

  const textElement = document.getElementById("text");
  const text = "HAND TO DIGITAL TEXT";
  let index = 0;

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
  setInterval(changeImage, 2500);
}
