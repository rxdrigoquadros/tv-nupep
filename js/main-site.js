/**
 * TV NUPEP - Script para as páginas institucionais
 * Responsável pela funcionalidade básica das páginas não-vídeo
 */

document.addEventListener('DOMContentLoaded', function() {
    // Toggle para o menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      
      // Fechar o menu ao clicar em um link
      document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
    
    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Adicionar classe ativa ao link do menu atual
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
      if (link.getAttribute('href') === currentPath || 
          (currentPath.endsWith('/') && link.getAttribute('href') === currentPath + 'index.html')) {
        link.classList.add('active');
      }
    });
  });