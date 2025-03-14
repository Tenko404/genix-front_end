<template>
  <!-- Define o elemento raiz do componente, um rodapé (footer) -->
  <footer class="footer" role="contentinfo">
    <!-- Adiciona classes CSS para estilização e define o papel do elemento para acessibilidade -->
    <!-- `role="contentinfo"` indica que este elemento contém informações sobre o conteúdo do site -->
    
    <div class="footer-content">
      <!-- Contêiner para o conteúdo do rodapé, centralizado e com largura máxima -->
      
      <nav class="footer-links" aria-label="Links do rodapé">
        <!-- Barra de navegação para os links do rodapé -->
        <!-- `aria-label` fornece uma descrição para leitores de tela -->
        
        <a href="/sobre" aria-label="Ir para página Sobre">Sobre</a>
        <!-- Link para a página "Sobre" com um texto alternativo para acessibilidade -->
        
        <a href="/aplicativos" aria-label="Ir para página Aplicativos">Aplicativos</a>
        <!-- Link para a página "Aplicativos" com um texto alternativo para acessibilidade -->
        
        <a href="/contato" aria-label="Ir para página Contato">Contato</a>
        <!-- Link para a página "Contato" com um texto alternativo para acessibilidade -->
      </nav>
      
      <div class="footer-social" aria-label="Redes sociais">
        <!-- Contêiner para os links das redes sociais -->
        <!-- `aria-label` fornece uma descrição para leitores de tela -->
        
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Siga-nos no Instagram"
        >
          <!-- Link para o perfil do Instagram -->
          <!-- `target="_blank"` abre o link em uma nova aba -->
          <!-- `rel="noopener noreferrer"` melhora a segurança ao abrir links em novas abas -->
          <!-- `aria-label` fornece uma descrição para leitores de tela -->
          <i class="fab fa-instagram"></i>
          <!-- Ícone do Instagram (Font Awesome) -->
        </a>
        
        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Siga-nos no X"
        >
          <!-- Link para o perfil do Twitter -->
          <!-- `target="_blank"` abre o link em uma nova aba -->
          <!-- `rel="noopener noreferrer"` melhora a segurança ao abrir links em novas abas -->
          <!-- `aria-label` fornece uma descrição para leitores de tela -->
          <i class="fab fa-twitter"></i>
          <!-- Ícone do Twitter (Font Awesome) -->
        </a>
        
        <a
          href="https://github.com/lfslDEV"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visite nosso GitHub"
        >
          <!-- Link para o perfil do GitHub -->
          <!-- `target="_blank"` abre o link em uma nova aba -->
          <!-- `rel="noopener noreferrer"` melhora a segurança ao abrir links em novas abas -->
          <!-- `aria-label` fornece uma descrição para leitores de tela -->
          <i class="fab fa-github"></i>
          <!-- Ícone do GitHub (Font Awesome) -->
        </a>
      </div>
      
      <div class="footer-copyright">
        <!-- Contêiner para a mensagem de copyright -->
        © {{ currentYear }} Meu Catálogo de Filmes. Todos os direitos reservados.
        <!-- Exibe a mensagem de copyright com o ano atual -->
        <!-- `{{ currentYear }}` é uma interpolação que exibe o valor da propriedade `currentYear` -->
      </div>
    </div>
  </footer>
</template>
  
  <script>
export default {
  // Define as opções do componente
  name: 'FilmeFooter', // Nome do componente
  data() {
    // Define os dados reativos do componente
    return {
      currentYear: new Date().getFullYear()
      // Define a propriedade `currentYear` com o ano atual
      // `new Date()` cria um objeto Date com a data atual
      // `getFullYear()` retorna o ano atual
    }
  }
};
</script>
  
  <style scoped>
/* Variáveis CSS */
.footer {
  background-color: var(--header-bg);
  color: var(--text-color);
  padding: 2rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  min-height: 137px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Navegação */
.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.footer-links a:hover {
  color: var(--text-color);
  opacity: 0.8;
}

/* Redes sociais */
.footer-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.2rem;
}

.footer-social a {
  color: var(--secondary-text);
  transition: color 0.2s ease-in-out;
}

.footer-social a:hover {
  color: var(--text-color);
}

/* Copyright */
.footer-copyright {
  font-size: 0.8rem;
  color: var(--secondary-text);
  margin-top: 1rem;
}
</style>