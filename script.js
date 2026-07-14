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
        { file: "index.html", label: "Home" },
        { file: "applications.html", label: "Applications" },
        { file: "games.html", label: "Games" },
        { file: "webapp.html", label: "Web App" },
        { file: "websites.html", label: "Website" },
        { file: "graphics.html", label: "Graphics" }
    ];

    if (navTarget) {
        navTarget.innerHTML = `
            <nav class="navbar">
                <a class="logo" href="index.html">Mario Petrov</a>
                <button class="hamburger" id="hamburger-menu" aria-label="Toggle Navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-links" id="nav-links">
                    ${pages.map(page => `
                        <a href="${page.file}" class="nav-link${currentPage === page.file ? " active" : ""}"${currentPage === page.file ? ' aria-current="page"' : ""}>${page.label}</a>
                    `).join("")}
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
    }

    if (footerTarget) {
        footerTarget.innerHTML = "&copy; Mario Petrov | Artificial Intelligence aspiring AI student";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderSiteShell();
    document.body.classList.add("loaded");
    scalePhone();

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href && !href.startsWith("#") && !href.startsWith("mailto:")) {
                if (this.getAttribute("target") === "_blank") return;
                
                // If it is a download link, bypass the page fade-out transition
                if (this.classList.contains("download") || 
                    this.hasAttribute("download") || 
                    href.toLowerCase().endsWith(".exe") || 
                    href.toLowerCase().endsWith(".zip")) {
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

    phone.style.transform = `translateX(-50%) scale(${scale})`;
    phone.style.transformOrigin = "top center";

    const wrapper = phone.parentElement;
    if (wrapper) {
        wrapper.style.height = `${baseHeight * scale}px`;
        wrapper.style.width = `${baseWidth * scale}px`;
    }
}

window.addEventListener("load", scalePhone);
window.addEventListener("resize", scalePhone);
scalePhone();