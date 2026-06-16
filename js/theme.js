        document.addEventListener("DOMContentLoaded", () => {
            const themeToggleBtn = document.getElementById("themeToggleBtn");
            const themeToggleIcon = document.getElementById("themeToggleIcon");
            const htmlElement = document.documentElement;

            // Load saved preference or defaults to system setting
            const savedTheme = localStorage.getItem("chatverse-theme");
            if (savedTheme) {
                htmlElement.setAttribute("data-theme", savedTheme);
                updateToggleIcon(savedTheme);
            } else {
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const activeTheme = systemPrefersDark ? "dark" : "light";
                htmlElement.setAttribute("data-theme", activeTheme);
                updateToggleIcon(activeTheme);
            }

            themeToggleBtn.addEventListener("click", () => {
                const currentTheme = htmlElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "light" : "dark";
                
                htmlElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("chatverse-theme", newTheme);
                updateToggleIcon(newTheme);
            });

            function updateToggleIcon(theme) {
                if (!themeToggleIcon) return;
                if (theme === "dark") {
                    themeToggleIcon.setAttribute("data-lucide", "sun");
                } else {
                    themeToggleIcon.setAttribute("data-lucide", "moon");
                }
                // Re-render lucide elements to swap the icon shape on the fly
                if (typeof lucide !== "undefined") {
                    lucide.createIcons();
                }
            }
        });