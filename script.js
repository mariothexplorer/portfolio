function getCurrentPage() {
    const pathname = (window.location.pathname || "").replace(/\\/g, "/");
    const page = pathname.split("/").pop();
    return page || "index.html";
}

function renderSiteShell() {
    const navTarget = document.getElementById("site-nav");
    const footerTarget = document.getElementById("site-footer");
    const currentPage = getCurrentPage();

    const pages = [
        { file: "index.html", labelEn: "Home", labelBg: "Начало" },
        { file: "applications.html", labelEn: "Applications", labelBg: "Приложения" },
        { file: "games.html", labelEn: "Games", labelBg: "Игри" },
        { file: "webapp.html", labelEn: "Web App", labelBg: "Уеб апликация" },
        { file: "websites.html", labelEn: "Website", labelBg: "Сайт" },
        { file: "graphics.html", labelEn: "Graphics", labelBg: "Графика" }
    ];

    if (navTarget) {
        let currentLang = "en";
        try {
            currentLang = localStorage.getItem("portfolio-lang") || "en";
        } catch (e) {
            console.warn("Storage access restricted on load:", e);
        }

        navTarget.innerHTML = `
            <nav class="navbar">
                <a class="logo" href="index.html">
                    <span lang="en">Mario Petrov</span>
                    <span lang="bg">Марио Петров</span>
                </a>
                
                <div class="nav-links" id="nav-links">
                    ${pages.map(page => `
                        <a href="${page.file}" class="nav-link${currentPage === page.file ? " active" : ""}"${currentPage === page.file ? ' aria-current="page"' : ""}>
                            <span lang="en">${page.labelEn}</span>
                            <span lang="bg">${page.labelBg}</span>
                        </a>
                    `).join("")}
                </div>

                <div class="nav-right">
                    <div class="lang-switcher">
                        <button class="lang-btn${currentLang === 'en' ? ' active' : ''}" id="lang-btn-en" aria-label="Switch to English">
                            <img src="assets/images/flag_uk.svg" alt="English">
                        </button>
                        <button class="lang-btn${currentLang === 'bg' ? ' active' : ''}" id="lang-btn-bg" aria-label="Switch to Bulgarian">
                            <img src="assets/images/flag_bg.svg" alt="Bulgarian">
                        </button>
                    </div>
                    
                    <button class="hamburger" id="hamburger-menu" aria-label="Toggle Navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>
        `;

        const hamburger = document.getElementById("hamburger-menu");
        const navLinks = document.getElementById("nav-links");
        
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", (e) => {
                e.stopPropagation();
                hamburger.classList.toggle("active");
                navLinks.classList.toggle("active");
            });

            document.addEventListener("click", (e) => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    hamburger.classList.remove("active");
                    navLinks.classList.remove("active");
                }
            });
        }

        const btnEn = document.getElementById("lang-btn-en");
        const btnBg = document.getElementById("lang-btn-bg");

        function updateLangUI(lang) {
            try {
                localStorage.setItem("portfolio-lang", lang);
            } catch (e) {
                console.warn("Storage write restricted:", e);
            }
            if (lang === "bg") {
                document.documentElement.classList.add("lang-bg");
                document.documentElement.setAttribute("lang", "bg");
                if (btnBg) btnBg.classList.add("active");
                if (btnEn) btnEn.classList.remove("active");
            } else {
                document.documentElement.classList.remove("lang-bg");
                document.documentElement.setAttribute("lang", "en");
                if (btnEn) btnEn.classList.add("active");
                if (btnBg) btnBg.classList.remove("active");
            }
            updatePageTitle(lang);
        }

        if (btnEn && btnBg) {
            btnEn.addEventListener("click", () => updateLangUI("en"));
            btnBg.addEventListener("click", () => updateLangUI("bg"));
        }
    }

    if (footerTarget) {
        footerTarget.innerHTML = `
            <div>
                <span lang="en">&copy; Mario Petrov</span>
                <span lang="bg">&copy; Марио Петров</span>
            </div>
            <div style="margin-top: 8px;">
                <a href="https://www.linkedin.com/in/mariothexplorer" target="_blank" rel="noopener noreferrer" lang="en">LinkedIn</a>
                <a href="https://www.linkedin.com/in/mariothexplorer" target="_blank" rel="noopener noreferrer" lang="bg">LinkedIn</a>
            </div>
        `;
    }
}

function updatePageTitle(lang) {
    const pages = [
        { file: "index.html", labelEn: "Portfolio", labelBg: "Портфолио" },
        { file: "applications.html", labelEn: "Applications", labelBg: "Приложения" },
        { file: "games.html", labelEn: "Games", labelBg: "Игри" },
        { file: "webapp.html", labelEn: "Web App", labelBg: "Уеб апликация" },
        { file: "websites.html", labelEn: "Website", labelBg: "Сайт" },
        { file: "graphics.html", labelEn: "Graphics", labelBg: "Графика" }
    ];
    const currentPage = getCurrentPage();
    const pageObj = pages.find(p => p.file === currentPage);
    if (pageObj) {
        if (currentPage === "index.html") {
            document.title = lang === "bg" ? "Марио Петров | Портфолио" : "Mario Petrov | Portfolio";
        } else {
            document.title = lang === "bg" 
                ? `${pageObj.labelBg} | Марио Петров` 
                : `${pageObj.labelEn} | Mario Petrov`;
        }
    }
}

function initPage() {
    let savedLang = "en";
    try {
        savedLang = localStorage.getItem("portfolio-lang") || "en";
    } catch (e) {
        console.warn("Storage access restricted on init:", e);
    }
    
    if (savedLang === "bg") {
        document.documentElement.classList.add("lang-bg");
        document.documentElement.setAttribute("lang", "bg");
    } else {
        document.documentElement.classList.remove("lang-bg");
        document.documentElement.setAttribute("lang", "en");
    }

    renderSiteShell();
    updatePageTitle(savedLang);
    document.body.classList.add("loaded");
    scalePhone();
}

document.addEventListener("DOMContentLoaded", () => {
    initPage();

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href && !href.startsWith("#") && !href.startsWith("mailto:")) {
                if (this.getAttribute("target") === "_blank") return;
                
                // If it is a download link, bypass the page fade-out transition
                if (this.classList.contains("download") || 
                    this.hasAttribute("download") || 
                    href.toLowerCase().endsWith(".exe") || 
                    href.toLowerCase().endsWith(".zip") || 
                    href.toLowerCase().endsWith(".apk")) {
                    return;
                }

                e.preventDefault();

                document.body.classList.remove("loaded");

                setTimeout(() => {
                    window.location.href = href;
                }, 250);
            }
        });
    });
});

function scalePhone() {
    const phone = document.getElementById("iphoneFrame");
    if (!phone) return;

    const baseHeight = 880;
    const baseWidth = 430;

    const isMobile = window.innerWidth <= 768;
    const availableHeight = window.innerHeight - 160;
    const availableWidth = isMobile ? (window.innerWidth - 40) : (window.innerWidth / 2);

    const scaleByHeight = availableHeight / baseHeight;
    const scaleByWidth = availableWidth / baseWidth;

    const scale = isMobile ? Math.min(scaleByWidth, 1) : Math.min(scaleByHeight, scaleByWidth, 1);

    // Apply centering and positioning inline to prevent browser caching of external CSS
    phone.style.position = "absolute";
    phone.style.left = "50%";
    phone.style.top = isMobile ? "0" : "-100px";
    phone.style.transform = `translateX(-50%) scale(${scale})`;
    phone.style.transformOrigin = "top center";

    const wrapper = phone.parentElement;
    if (wrapper) {
        wrapper.style.flex = "none";
        wrapper.style.position = "relative";
        wrapper.style.overflow = isMobile ? "hidden" : "visible";
        wrapper.style.borderRadius = "55px";
        const shiftOffset = isMobile ? 0 : 100;
        wrapper.style.height = `${(baseHeight * scale) - shiftOffset}px`;
        wrapper.style.width = `${baseWidth * scale}px`;
    }
}

window.addEventListener("load", scalePhone);
window.addEventListener("resize", scalePhone);
window.addEventListener("pageshow", (event) => {
    initPage();
});
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        scalePhone();
    }
});
scalePhone();