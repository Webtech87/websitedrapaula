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
    title: "O brincar e o processamento sensorial em criancas dos 36 aos 72 meses",
    author: "Margarida Isabel Dias Ribeiro Sabino Cardoso",
    type: "artigo",
    date: "12/07/2024",
    description: "Brincar é a principal ocupação nos primeiros anos de vida da criança, existindo um papel central do processamento sensorial no desenvolvimento do brincar (Parham & Fazio, 2008). Neste sentido, importa perceber a relação que existe entre o processamento sensorial da criança e as competências do brincar. ",
    file: "Projeto Final_Brincar e Processamento Sensorial dos 36 aos 72 meses_julho_Margarida Cardoso (2).pdf",
  },
  {
    id: 2,
    title: "Construção e validação de uma grelha de avaliação dos comportamentos do brincar com o corpo, de bebés entre os 10 e os 12 meses, em contexto educativo e sua relação com o perfil sensorial 2",
    author: "Jéssica Filipa Dias Pereira",
    type: "tese",
    date: "03/02/2023",
    description: "Ao brincar a criança dá significado ao mundo que a rodeia, expressa-se e estabelece relacionamentos com os outros.",
    file: "Projeto Final_Brincar e Processamento Sensorial dos 36 aos 72 meses_julho_Margarida Cardoso (2).pdf",
  },
  {
    id: 3,
    title: "Ergonomia no Ambiente de Trabalho Remoto",
    author: "Ana Margarida Almeida Reis",
    type: "artigo",
    date: "22/07/2023",
    description: "Avaliar a capacidade discriminativa do teste de estereognosia do SASI: comparação da prova com e sem alterações.",
    file: "Projeto Final_Brincar e Processamento Sensorial dos 36 aos 72 meses_julho_Margarida Cardoso (2).pdf",
  },
  {
    id: 4,
    title: "Screening Assessment of Sensory Integration (SASI) - Research Ed. V.2.2: Análise da capacidade discriminativa do teste de estereognosia de crianças portuguesas entre os 4 e 7 anos e 11 meses",
    author: "Ana Margarida Almeida Reis",
    type: "tese",
    date: "15/02/2023",
    description: "Avaliar a capacidade discriminativa do teste de estereognosia do SASI: comparação da prova com e sem alterações.",
    file: "Projeto Final_Brincar e Processamento Sensorial dos 36 aos 72 meses_julho_Margarida Cardoso (2).pdf",
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
        fileUrl = `/pdfs/${article.file}`;
      } else {
        // For real backend data, use the appropriate path
        // Extract just the filename from the full path (if any)
        const fileName = article.file.split('/').pop();
        fileUrl = `/pdfs/${fileName}`;
      }

      // Log the file URL for debugging
      console.log(`Attempting to download file from: ${fileUrl}`);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${article.title.replace(/\s+/g, "_")}.pdf`);
      
      // For some browsers that require the link to be in the DOM
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
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
                    {expandedArticles[article.id] ? "Recolher" : "Ler Mais"}
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
