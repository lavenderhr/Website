document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const backTop = document.querySelector(".back-to-top");

  const setHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", setHeader, {passive:true});
  setHeader();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open"); toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded","false"); toggle.setAttribute("aria-label","Open menu");
      document.body.classList.remove("menu-open");
    }));
  }

  if (backTop) backTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveal.length) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), {threshold:.12});
    reveal.forEach(el => io.observe(el));
  }

  const counters = document.querySelectorAll("[data-counter]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = Number(el.dataset.counter), duration = 1100;
      let start = null;
      const step = t => {
        if (!start) start = t;
        const p = Math.min((t-start)/duration,1);
        el.textContent = Math.floor((1-Math.pow(1-p,3))*target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    }), {threshold:.7});
    counters.forEach(el => cio.observe(el));
  }

  const form = document.querySelector("#contactForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Lavender HR enquiry${data.get("company") ? " — " + data.get("company") : ""}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company") || ""}\nWhat can I help with?: ${data.get("topic") || ""}\n\nMessage:\n${data.get("message")}`
    );
    window.location.href = `mailto:contactus@lavenderhr.co.uk?subject=${subject}&body=${body}`;
  });
});