document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.querySelector(".content");
    const navLinks = document.querySelectorAll(".nav-link");

    // Load last visited page from sessionStorage (or default to 'home')
    let lastPage = sessionStorage.getItem("lastPage") || "/home/";
    loadPage(lastPage);

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            
            const page = link.getAttribute("data-page"); // Extract page name
            sessionStorage.setItem("lastPage", page); // Save in sessionStorage
            
            loadPage(page);
            updateActiveTab(link); // Update selected tab style
        });
    });

    function loadPage(page) {
        fetch(`./pages${page}`)
            .then(response => {
                if (!response.ok) throw new Error(`Page ${page} not found`);
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const newContent = doc.querySelector(".content");
                if (newContent) {
                    const styles = Array.from(doc.querySelectorAll("link[rel='stylesheet']")).map(link => link.href);
                    const scripts = Array.from(doc.querySelectorAll("script")).map(script => script.src).filter(src => src);
                    contentDiv.innerHTML = newContent.innerHTML;
                    loadStyles(styles);
                    loadScripts(scripts);
                    const activeLink = [...navLinks].find(link => link.getAttribute("data-page") === page);
                    if (activeLink) updateActiveTab(activeLink);   
                } else {
                    console.error(`.content div not found in ${page}`);
                }
            })
            .catch(() => contentDiv.innerHTML = "<h1>Page not found</h1>");
    }
});

// ✅ Function to update active tab styling
function updateActiveTab(activeLink) {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("current"); // Remove active class from all links
    });
    activeLink.classList.add("current"); // Add active class to selected link
}

// ✅ Load styles dynamically (local + CDN)
function loadStyles(styles) {
    document.querySelectorAll("link[data-dynamic-style]").forEach(link => link.remove());

    styles.forEach(cssPath => {
        if (!document.querySelector(`link[href="${cssPath}"]`)) { // Prevent duplicates
            const newStyle = document.createElement("link");
            newStyle.rel = "stylesheet";
            newStyle.href = cssPath;
            newStyle.setAttribute("data-dynamic-style", "true");
            document.head.appendChild(newStyle);
        }
    });
}

// ✅ Load scripts dynamically (local + CDN)
function loadScripts(scripts) {
    document.querySelectorAll("script[data-dynamic-script]").forEach(script => script.remove());

    scripts.forEach(jsPath => {
        if (!document.querySelector(`script[src="${jsPath}"]`)) { // Prevent duplicates
            const newScript = document.createElement("script");
            newScript.src = jsPath;
            newScript.setAttribute("data-dynamic-script", "true");
            newScript.defer = true;
            document.body.appendChild(newScript);
        }
    });
}
