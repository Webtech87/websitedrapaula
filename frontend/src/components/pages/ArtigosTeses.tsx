import React, { useState, useEffect } from "react";
import "../../styles/pages/artigosTeses.css";

// Extended data with more info and download links
const articlesData = [
  {
    id: 1,
    title: "Integração Sensorial em Crianças com Transtornos do Neurodesenvolvimento",
    author: "Paula Serrano",
    type: "artigo",
    date: "Junho 2023",
    description: "Estudo abrangente sobre os efeitos da terapia de integração sensorial em crianças com transtornos do espectro autista e TDAH, demonstrando melhorias significativas na regulação emocional e habilidades motoras.",
    link: "#",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Neurodesenvolvimento e Aprendizagem: Uma Perspectiva Integrativa",
    author: "Paula Serrano",
    type: "tese",
    date: "Março 2022",
    description: "Análise das conexões entre desenvolvimento neurológico e processos de aprendizagem, com foco em intervenções precoces para otimizar o desenvolvimento cognitivo em crianças de 3 a 7 anos.",
    link: "#",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "O Papel do Brincar no Desenvolvimento Sensório-Motor",
    author: "Paula Serrano, Maria Oliveira",
    type: "artigo",
    date: "Outubro 2022",
    description: "Investigação sobre como atividades lúdicas estruturadas podem promover o desenvolvimento sensório-motor em crianças com atrasos no desenvolvimento, incluindo estudos de caso e metodologias práticas.",
    link: "#",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Intervenções Baseadas em Evidências para Crianças com Disfunções Sensoriais",
    author: "Paula Serrano",
    type: "tese",
    date: "Janeiro 2023",
    description: "Revisão sistemática das intervenções terapêuticas para disfunções sensoriais, avaliando eficácia e aplicabilidade em diferentes contextos clínicos e educacionais.",
    link: "#",
    downloadUrl: "#"
  }
];

const ArtigosTeses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState(articlesData);
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter articles based on search term and active filter
    const filtered = articlesData.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === "todos" || article.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
    
    setArticles(filtered);
  }, [searchTerm, activeFilter]);

const handleFilterClick = (filter: "todos" | "artigo" | "tese"): void => {
    setActiveFilter(filter);
};

  const handleDownload = (articleId: number): void => {
    // In a real application, this would trigger the download
    console.log(`Downloading article ID: ${articleId}`);
    // For demonstration, we'll show an alert
    alert(`O download do artigo foi iniciado. Em uma aplicação real, o arquivo seria baixado.`);
  };

  const toggleExpandArticle = (articleId: number) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  return (
    <div className="artigos-teses-container">
      <div className="artigos-teses-hero">
        <h1 className="artigos-teses-title">Artigos e Teses Acadêmicas</h1>
        <p className="artigos-teses-subtitle">
          Conhecimento científico em Terapia Ocupacional para profissionais e estudantes
        </p>
      </div>

      <div className="search-filter-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por título, autor ou conteúdo..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${activeFilter === "todos" ? "active" : ""}`}
            onClick={() => handleFilterClick("todos")}
          >
            <span className="filter-icon">📋</span>
            Todos
          </button>
          <button
            className={`filter-button ${activeFilter === "artigo" ? "active" : ""}`}
            onClick={() => handleFilterClick("artigo")}
          >
            <span className="filter-icon">📄</span>
            Artigos
          </button>
          <button
            className={`filter-button ${activeFilter === "tese" ? "active" : ""}`}
            onClick={() => handleFilterClick("tese")}
          >
            <span className="filter-icon">📚</span>
            Teses
          </button>
        </div>
      </div>

      <div className="publications-stats">
        <p>Mostrando {articles.length} de {articlesData.length} publicações</p>
      </div>

      {isLoading ? (
        <div className="artigos-teses-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="publication-card skeleton-card">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-button"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="artigos-teses-grid">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.id} className="publication-card">
                <div className="publication-header">
                  <div className="publication-type">
                    <span className="publication-icon">
                      {article.type === "artigo" ? "📄" : "📚"}
                    </span>
                    <span>{article.type === "artigo" ? "Artigo" : "Tese"}</span>
                  </div>
                  <h2 className="publication-title">{article.title}</h2>
                  <div className="publication-meta">
                    <span className="publication-author">Por {article.author}</span>
                    <span className="publication-date">{article.date}</span>
                  </div>
                </div>
                <div className="publication-content">
                  <p className={`publication-description ${expandedArticles[article.id] ? 'expanded' : ''}`}>
                    {article.description}
                  </p>
                </div>
                <div className="publication-actions">
                  <button
                    className="publication-read-button"
                    onClick={() => toggleExpandArticle(article.id)}
                    aria-label={expandedArticles[article.id] ? `Recolher ${article.title}` : `Ler ${article.title}`}
                  >
                    {expandedArticles[article.id] ? 'Recolher' : 'Ler Completo'}
                  </button>
                  <button 
                    className="publication-download-button"
                    onClick={() => handleDownload(article.id)}
                    aria-label={`Baixar ${article.title}`}
                  >
                    📥
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Nenhuma publicação encontrada com os critérios selecionados.</p>
              <button 
                className="reset-button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("todos");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtigosTeses;
