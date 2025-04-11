// Script para as páginas institucionais - versão simplificada

// Função para alternar a visibilidade do menu hambúrguer
function toggleHamburgerMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    navLinks.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
}

// Função para mudar o fundo do header ao rolar
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Event listeners
window.addEventListener('scroll', handleScroll);

// Botão do menu hambúrguer
document.getElementById('hamburger-menu').addEventListener('click', toggleHamburgerMenu);

// Fechar o menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('nav-links').classList.remove('active');
        document.getElementById('hamburger-menu').classList.remove('active');
    });
});