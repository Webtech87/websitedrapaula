import React, { useState, useEffect } from "react";
import "../../styles/pages/artigosTeses.css";
import axios from "axios";
import { toast } from "sonner";

interface Article {
  id: number;
  title: string;
  author: string;
  type: "artigo" | "tese";
  date: string;
  description: string;
  file: string;
}

// Sample articles data for development/testing
const sampleArticles: Article[] = [
  {
    id: 1,
    title: "Terapia Ocupacional na Reabilitação Neurológica",
    author: "Dra. Ana Silva",
    type: "artigo",
    date: "12/05/2023",
    description: "Este artigo explora abordagens inovadoras em terapia ocupacional para pacientes com lesões neurológicas. A reabilitação neurológica através da terapia ocupacional é um campo em constante evolução, com novas técnicas sendo desenvolvidas para melhorar a qualidade de vida dos pacientes.",
    file: "/Users/santiclinic/Desktop/clone/websitedrapaula/backend/media/documents/ProjetodeInvestigação_JéssicaPereira  (1).pdf",
  },
  {
    id: 2,
    title: "Intervenções em Crianças com TEA",
    author: "Dr. Carlos Mendes",
    type: "tese",
    date: "03/11/2022",
    description: "Esta tese analisa diferentes abordagens terapêuticas ocupacionais para crianças com Transtorno do Espectro Autista. O estudo apresenta resultados de intervenções realizadas ao longo de dois anos, demonstrando os benefícios de abordagens personalizadas.",
    file: "sample-document.pdf",
  },
  {
    id: 3,
    title: "Ergonomia no Ambiente de Trabalho Remoto",
    author: "Profa. Marina Costa",
    type: "artigo",
    date: "22/07/2023",
    description: "Com o aumento do trabalho remoto, este artigo aborda os principais desafios ergonômicos enfrentados por profissionais em home office e como a terapia ocupacional pode contribuir para ambientes mais saudáveis.",
    file: "sample-document.pdf",
  },
  {
    id: 4,
    title: "Reabilitação de Membros Superiores em Pacientes Pós-AVC",
    author: "Dr. Roberto Almeida",
    type: "tese",
    date: "15/01/2023",
    description: "Estudo longitudinal sobre técnicas de terapia ocupacional para a recuperação da função motora em membros superiores após Acidente Vascular Cerebral, com foco em atividades de vida diária.",
    file: "sample-document.pdf",
  },
];

const ArtigosTeses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [allArticles, setAllArticles] = useState<Article[]>([]); // All articles from API
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // Filtered articles
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});
  const [useLocalData, setUseLocalData] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://websitedrapaula.onrender.com/api/documents/");
        console.log("Fetched articles:", response.data); // Debug API response
        setAllArticles(response.data);
        setFilteredArticles(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // If API fails, use sample data
        setUseLocalData(true);
        setAllArticles(sampleArticles);
        setFilteredArticles(sampleArticles);
        setIsLoading(false);
        toast.error("Não foi possível conectar ao servidor. Usando dados de exemplo para demonstração.");
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = allArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = activeFilter === "todos" || article.type === activeFilter;

      return matchesSearch && matchesFilter;
    });

    setFilteredArticles(filtered);
  }, [searchTerm, activeFilter, allArticles]);

  const handleFilterClick = (filter: "todos" | "artigo" | "tese"): void => {
    setActiveFilter(filter);
  };

  const handleDownload = (article: Article): void => {
    // Check if the file URL exists
    if (!article.file) {
      toast.error(`Arquivo não disponível para "${article.title}"`);
      return;
    }

    try {
      // Create a file path based on whether we're using local data or API data
      let fileUrl;

      if (useLocalData) {
        // For sample data during development, use the local public folder
        fileUrl = `/sample-document.pdf`;
      } else {
        // For real backend data, use the path to your media files
        fileUrl = `http://websitedrapaula.onrender.com/media/documents/${article.file}`;

        // Log the file URL for debugging
        console.log(`Attempting to download file from: ${fileUrl}`);
      }

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${article.title.replace(/\s+/g, "_")}.pdf`);
      link.setAttribute("target", "_blank"); // Open in new tab (optional)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Download de "${article.title}" iniciado`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Erro ao baixar "${article.title}"`);
    }
  };

  const toggleExpandArticle = (articleId: number) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  return (
    <div className="artigos-teses-container">
      <div className="artigos-teses-hero">
        <h1 className="artigos-teses-title">Artigos e Teses Acadêmicas</h1>
        <p className="artigos-teses-subtitle">
          Conhecimento científico em Terapia Ocupacional para profissionais e estudantes
        </p>
        {useLocalData && (
          <div className="sample-data-notice">
            <p>Exibindo dados de exemplo para demonstração. No ambiente de produção, os documentos reais serão exibidos.</p>
          </div>
        )}
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
        <p>Mostrando {filteredArticles.length} de {allArticles.length} publicações</p>
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
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
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
                  <p
                    className={`publication-description ${
                      expandedArticles[article.id] ? "expanded" : ""
                    }`}
                  >
                    {article.description}
                  </p>
                </div>
                <div className="publication-actions">
                  <button
                    className="publication-read-button"
                    onClick={() => toggleExpandArticle(article.id)}
                    aria-label={
                      expandedArticles[article.id]
                        ? `Recolher ${article.title}`
                        : `Ler ${article.title}`
                    }
                  >
                    {expandedArticles[article.id] ? "Recolher" : "Ler Completo"}
                  </button>
                  <button
                    className="publication-download-button"
                    onClick={() => handleDownload(article)}
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