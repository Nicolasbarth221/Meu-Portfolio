document.addEventListener("DOMContentLoaded", () => {
  const slideTitles = [
    "Portfólio<br>Audiovisual",
    "Vídeos que Conectam<br>Pessoas",
    "Marketing com<br>Criatividade",
    "Excelência do Roteiro<br>à Entrega Final"
  ];

  const slideDescriptions = [
    "Uma produção que vai além da estética!<br>Conteúdo com intenção, técnica e propósito.",
    "Porque cada história bem contada aproxima<br>marcas, inspira confiança e gera resultados.",
    "Seu negócio precisa ser lembrado e criatividade<br>é o que faz isso acontecer.",
    "Do planejamento à pós-produção, tudo é feito<br>para entregar um resultado impecável."
  ];

  const slideImages = [
    "assets/img/Eu_Profi.png",
    "assets/img/Carrosel/image2.png",
    "assets/img/Carrosel/image3.png",
    "assets/img/Carrosel/image4.png"
  ];

  const FADE_MS = 700;
  const SLIDE_MS = 5000;

  let slideIndex = 0;
  const heroTitle = document.getElementById("hero-title");
  const heroDesc = document.getElementById("hero-description");
  const heroImage = document.getElementById("hero-image");

  function setHeroContent(i) {
    if (!heroTitle || !heroDesc || !heroImage) return;
    heroTitle.innerHTML = slideTitles[i];
    heroDesc.innerHTML = slideDescriptions[i];
    heroImage.src = slideImages[i];
  }

  function changeSlide(nextIndex = null) {
    slideIndex = nextIndex !== null ? nextIndex : (slideIndex + 1) % slideTitles.length;
    if (!heroTitle || !heroDesc || !heroImage) return;

    heroTitle.classList.add("fade-out");
    heroDesc.classList.add("fade-out");
    heroImage.classList.add("fade-out");

    setTimeout(() => {
      setHeroContent(slideIndex);
      heroTitle.classList.remove("fade-out");
      heroDesc.classList.remove("fade-out");
      heroImage.classList.remove("fade-out");
    }, FADE_MS);
  }

  setHeroContent(0);
  setInterval(changeSlide, SLIDE_MS);

  const serviceCards = document.querySelectorAll(".caixa.expandivel");
  const expandedHost = document.createElement("div");
  expandedHost.classList.add("conteudo-expandido-global");
  document.body.appendChild(expandedHost);

  function closeExpanded() {
    expandedHost.innerHTML = "";
    document.body.classList.remove("no-scroll");
    document.querySelectorAll(".caixa.expandivel").forEach(c => c.classList.remove("aberta"));
  }

  serviceCards.forEach((card) => {
    const original = card.querySelector(".conteudo-expandido");
    if (!original) return;

    card.addEventListener("click", (e) => {
      e.stopPropagation();
      closeExpanded();

      const rect = card.getBoundingClientRect();
      const startTop = rect.top + window.scrollY + rect.height / 2;
      const startLeft = rect.left + rect.width / 2;

      const clone = original.cloneNode(true);
      clone.style.setProperty("--start-top", `${startTop}px`);
      clone.style.setProperty("--start-left", `${startLeft}px`);
      clone.classList.add("expandido-externo");
      clone.setAttribute("role", "dialog");
      clone.setAttribute("aria-modal", "true");

      expandedHost.appendChild(clone);
      document.body.classList.add("no-scroll");

      requestAnimationFrame(() => clone.classList.add("ativo"));

      clone.querySelector(".btn-fechar")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        clone.classList.remove("ativo");
        setTimeout(closeExpanded, 300);
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".expandido-externo")) closeExpanded();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeExpanded();
  });

  window.expandirVideo = function (element) {
    const video = element?.querySelector("video");
    const fullDesc = element?.getAttribute("data-descricao");
    if (!video) return;

    const overlay = document.createElement("div");
    overlay.classList.add("video-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const videoClone = video.cloneNode(true);
    videoClone.controls = true;
    videoClone.muted = false;
    videoClone.autoplay = true;

    const description = document.createElement("p");
    description.classList.add("descricao-detalhada");
    description.textContent = fullDesc || "";

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("fechar-overlay");
    closeBtn.type = "button";
    closeBtn.ariaLabel = "Fechar vídeo";
    closeBtn.textContent = "✕";
    closeBtn.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(closeBtn);
    overlay.appendChild(videoClone);
    overlay.appendChild(description);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    document.addEventListener("keydown", escCloseOnce, { once: true });
    function escCloseOnce(ev) {
      if (ev.key === "Escape") {
        document.body.contains(overlay) && document.body.removeChild(overlay);
      }
    }

    document.body.appendChild(overlay);
    closeExpanded();
  };

  window.fecharExpandido = function () {
    const overlay = document.getElementById("overlay-video");
    const videoEl = document.getElementById("videoExpandidoEl");
    if (!overlay || !videoEl) return;
    videoEl.pause();
    videoEl.src = "";
    overlay.classList.remove("ativo");
  };

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#menuMobile");

  if (menuToggle && mobileMenu) {
    const toggleMenu = () => mobileMenu.classList.toggle("show");
    menuToggle.addEventListener("click", toggleMenu);
    menuToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
    document.querySelectorAll("#menuMobile a").forEach(link => {
      link.addEventListener("click", () => mobileMenu.classList.remove("show"));
    });
  }

  window.trocarHero = function (imgUrl, novoTitulo, novaDescricao) {
    if (!heroImage || !heroTitle || !heroDesc) return;
    heroImage.style.opacity = "0";
    heroTitle.style.opacity = "0";
    heroDesc.style.opacity = "0";

    setTimeout(() => {
      heroImage.src = imgUrl;
      heroTitle.innerHTML = novoTitulo;
      heroDesc.innerHTML = novaDescricao;
      heroImage.style.opacity = "1";
      heroTitle.style.opacity = "1";
      heroDesc.style.opacity = "1";
    }, 300);
  };
});
