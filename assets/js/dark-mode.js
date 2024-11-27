// Gerenciamento do tema
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Verifica se há preferência salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
}

// Verifica preferência do sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (!savedTheme && prefersDarkScheme.matches) {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    // Toggle dark mode
    body.classList.toggle('dark-mode');
    
    // Salva preferência
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Atualiza ícone baseado no tema atual
function updateThemeIcon() {
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? 
        '<i class="fas fa-sun"></i><i class="fas fa-moon"></i>' : 
        '<i class="fas fa-sun"></i><i class="fas fa-moon"></i>';
}

// Atualiza ícone inicial
updateThemeIcon();
