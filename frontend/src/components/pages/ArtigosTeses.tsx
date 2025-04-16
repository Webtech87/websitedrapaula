import React, {useState, useEffect} from "react";
import {toast} from "sonner";
import {Download} from "lucide-react";
import "../../styles/pages/artigosTeses.css";
import {saveAs} from 'file-saver';
import {useTranslation} from 'react-i18next';


interface Article {
    id: number;
    title: string;
    author: string;
    type: "artigo" | "tese";
    date: string;
    description: string;
    file: string;
}


// Sample articles data - using corrected filenames
const sampleArticles: Article[] = [
    {
        id: 1,
        title: "Adaptação cultural e linguística e recolha dos dados normativos das Structured Observations of Sensory Related Motor Performance",
        author: "Paula de Jesus Mendes Serrano",
        type: "tese",
        date: "Janeiro/2013",
        description: "Desde o início do desenvolvimento da teoria de integração sensorial...",
        file: "/pdfs/adaptacao-cultural-linguistica.pdf", // Corrected file path
    },
    {
        id: 2,
        title: "Screening Assessment of Sensory Integration (SASI) - Research Ed. V.2.2: Análise da capacidade discriminativa do teste de estereognosia de crianças portuguesas entre os 4 e 7 anos e 11 meses",
        author: "Ana Margarida Almeida Reis",
        type: "tese",
        date: "Fevereiro/2023",
        description: "O desenvolvimento dos sistemas sensoriais tem um papel essencial...",
        file: "/pdfs/analise-da-capacidade-discriminativa.pdf", // Corrected file path
    },
    {
        id: 3,
        title: "Comportamento e competências sociais em crianças dos 3 aos 5 anos: Relação com o processamento sensorial",
        author: "Margarida Isabel Araújo Oliveira",
        type: "tese",
        date: "Abril/2020",
        description: "As crianças com dificuldade de regulação sensorial demonstram dificuldades...",
        file: "/pdfs/comportamento-e-competencias-sociais.pdf", // Corrected file path
    },
    {
        id: 4,
        title: "Construção e validação de uma grelha de avaliação dos comportamentos do brincar com o corpo, de bebés entre os 10 e os 12 meses, em contexto educativo e sua relação com o perfil sensorial 2",
        author: "Jéssica Filipa Dias Pereira",
        type: "tese",
        date: "Fevereiro/2023",
        description: "Ao brincar a criança dá significado ao mundo que a rodeia, expressa-se e estabelece...",
        file: "/pdfs/comportamentos-brincar-corpo.pdf", // Corrected file path
    },
    {
        id: 5,
        title: "Contributo para adaptação cultural e linguística da Ayres Sensory Integration® Intervention Fidelity Measure para Língua Portuguesa",
        author: "João Pedro Mira Cadima",
        type: "tese",
        date: "Junho/2012",
        description: "Atualmente a intervenção segundo o modelo de Integração Sensorial, Ayres Sensory Integration...",
        file: "/pdfs/contributo-para-adaptacao-cultural-e-linguistica.pdf", // Corrected file path
    },
    {
        id: 6,
        title: "Neurociência do Brincar - Revisão Scoping",
        author: "Cláudia Alexandra Gonçalves Valente",
        type: "tese",
        date: "Dezembro/2021",
        description: "O Brincar tem sido pouco explorado e tem sido investigado sobretudo como...",
        file: "/pdfs/neurociencia-do-brincar.pdf", // Corrected file path
    },
    {
        id: 7,
        title: "O brincar e o processamento sensorial em crianças dos 36 aos 72 meses",
        author: "Margarida Isabel Dias Ribeiro Sabino Cardoso",
        type: "tese",
        date: "Julho/2024",
        description: "Brincar é a principal ocupação nos primeiros anos de vida da criança, existindo um papel...",
        file: "/pdfs/o-brincar-e-o-processamento-sensorial.pdf", // Corrected file path
    },
    {
        id: 8,
        title: "Problemas de sono e processamento sensorial: Estudo exploratório com grupo de crianças de 5 e 6 anos",
        author: "Ana Rita Silva Sousa",
        type: "tese",
        date: "Março/2019",
        description: "O sono e os problemas de sono têm vindo a merecer atenção na área da Terapia Ocupacional...",
        file: "/pdfs/problemas-de-sono-e-processamento-sensorial.pdf", // Corrected file path
    },
];

const ArtigosTeses = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("todos");
    const [isLoading, setIsLoading] = useState(false); // Changed to false since we're using local data
    const [allArticles] = useState<Article[]>(sampleArticles); // Directly use sample data
    const [filteredArticles, setFilteredArticles] = useState<Article[]>(sampleArticles);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;


    useEffect(() => {
        // Filter articles based on search and filter criteria
        const filtered = allArticles.filter((article) => {
            const matchesSearch =
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = activeFilter === "todos" || article.type === activeFilter;

            return matchesSearch && matchesFilter;
        });

        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, activeFilter, allArticles]);

    const handleFilterClick = (filter: "todos" | "artigo" | "tese") => {
        setActiveFilter(filter);
    };

    const handleDownload = async (article: Article) => {
        try {
            // 1. Construct the correct file path
            const baseUrl = window.location.origin; // Gets current domain (http://localhost:3000)
            const filePath = `${baseUrl}/pdfs/${article.file}`;

            // 2. Fetch the file
            const response = await fetch(filePath);

            // 3. Check if successful
            if (!response.ok) throw new Error('File not found (404)');

            // 4. Get file as blob
            const blob = await response.blob();

            // 5. Trigger download
            saveAs(blob, `${article.title.replace(/[^\w]/g, "_")}.pdf`);

            toast.success(`Download de "${article.title}" iniciado`);
        } catch (error) {
            console.error('Download error:', error);
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            toast.error(`Falha ao baixar: ${errorMessage}`);
        }
    };

    // Pagination calculations
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getPaginationNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                endPage = 3;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2;
            }

            if (startPage > 2) {
                pages.push(-1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push(-2);
            }

            pages.push(totalPages);
        }

        return pages;
    };


    const {t} = useTranslation();
    return (
        <div className="artigos-teses-container">
            <div className="artigos-teses-hero">
                <h1 className="artigos-teses-title">{t("atrigs_and_theses_h1")}</h1>
                <p className="artigos-teses-subtitle">
                    {t("atrigs_and_theses_p")}
                </p>
            </div>

            <div className="search-filter-section">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder={t("search_bar_palceholder")}
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
                        {t("all")}
                    </button>
                    <button
                        className={`filter-button ${activeFilter === "artigo" ? "active" : ""}`}
                        onClick={() => handleFilterClick("artigo")}
                    >
                        <span className="filter-icon">📄</span>
                        {t("article")}
                    </button>
                    <button
                        className={`filter-button ${activeFilter === "tese" ? "active" : ""}`}
                        onClick={() => handleFilterClick("tese")}
                    >
                        <span className="filter-icon">📚</span>
                        {t("teses")}
                    </button>
                </div>
            </div>

            <div className="publications-stats">
                <p>{t("showing")} {currentArticles.length} {t("of")} {filteredArticles.length} {t("publications")}</p>
            </div>

            <div className="artigos-teses-grid">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article) => (
                        <div key={article.id} className="publication-card">
                            <div className="publication-header">
                                <div className="publication-type">
                  <span className="publication-icon">
                    {article.type === "artigo" ? "📄" : "📚"}
                  </span>
                                    <span>{article.type === "artigo" ? "Artigo" : "Tese"}</span>
                                </div>
                                <h2 className="publication-title">{t(`articles.${article.id}.title`)}</h2>

                                <div className="publication-meta">
                                    <span className="publication-author">Por {article.author}</span>
                                    <span className="publication-date">{article.date}</span>
                                </div>
                            </div>
                            <div className="publication-content">
                                <p className="publication-description">
                                    {t(`articles.${article.id}.description`)}
                                </p>
                            </div>
                            <div className="publication-actions">
                                <button
                                    className="publication-download-button"
                                    onClick={() => handleDownload(article)}
                                    aria-label={`Baixar ${article.title}`}
                                >
                                    <Download size={18} className="download-icon"/>
                                    <span>Download PDF</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>{t("no_publications_find")}</p>
                        <button
                            className="reset-button"
                            onClick={() => {
                                setSearchTerm("");
                                setActiveFilter("todos");
                            }}
                        >
                            {t("clr_flt")}
                        </button>
                    </div>
                )}
            </div>

            {filteredArticles.length > articlesPerPage && (
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        ←
                    </button>

                    {getPaginationNumbers().map((number, index) => (
                        number < 0 ? (
                            <span key={index} className="pagination-ellipsis">...</span>
                        ) : (
                            <button
                                key={index}
                                className={`pagination-button ${currentPage === number ? "active" : ""}`}
                                onClick={() => paginate(number)}
                                aria-label={`Página ${number}`}
                            >
                                {number}
                            </button>
                        )
                    ))}

                    <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Próxima página"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArtigosTeses;