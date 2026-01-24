import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import Loader from "./common/Loader";
import ErrorMessage from "./common/ErrorMessage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProjectCard = ({ project, techColors }) => {
  const getTechStyle = (techName) => {
    const found = techColors.find(c => c.name.toLowerCase() === techName.toLowerCase());
    if (found) {
      return { backgroundColor: found.bgColor, color: found.textColor };
    }
    return { backgroundColor: "#6b7280", color: "#ffffff" }; // Default gray
  };

  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-border">
      <div className="relative overflow-hidden">
        <a href={project.projectUrl || project.link} target="_blank" rel="noreferrer" title="Tap to see">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-block rounded-full py-1 px-3 text-xs font-medium shadow-sm"
              style={getTechStyle(tech)}
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.github || "https://github.com/HasanAlsaafen"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-black dark:bg-slate-700 text-white rounded-full py-2 px-5 text-sm font-medium hover:bg-primary transition-colors"
        >
          View on GitHub <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>
    </article>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [techColors, setTechColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 3;

  const fetchTechColors = async () => {
    try {
      const response = await fetch(`${API_URL}/colorschemas`);
      if (response.ok) {
        const data = await response.json();
        setTechColors(data);
      }
    } catch (err) {
      console.error("Error fetching tech colors:", err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechColors();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <>
      <div className="mb-12 ml-4 md:ml-24 ">
        <h2
          className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 before:content-[''] before:w-8 before:h-[1px] before:bg-primary/30"
          id="projects"
        >
          Selected Works
        </h2>
        <h3 className="text-4xl font-extrabold text-text leading-tight">
          Featured <span className="text-primary">Projects</span>
        </h3>
      </div>

      <section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 ml-4 md:ml-24 min-h-[400px]"
        aria-labelledby="projects"
      >
        {loading ? (
          <div className="col-span-full py-10">
            <Loader message="Fetching creative works..." />
          </div>
        ) : error ? (
          <div className="col-span-full py-10">
            <ErrorMessage 
              message={error} 
              onRetry={() => fetchProjects()} 
            />
          </div>
        ) : projects.length > 0 ? (
          projects.map((proj) => (
            <ProjectCard key={proj._id || proj.id} project={proj} techColors={techColors} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 bg-secondary/10 rounded-3xl border border-dashed border-border/50">
            <p className="font-bold text-lg mb-2">No Projects Found</p>
            <p className="text-sm">Check back later for new updates!</p>
          </div>
        )}
      </section>

      <div className="flex flex-col items-center gap-6 mb-16">
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1 || loading}
            className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-text hover:bg-primary hover:border-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Previous Page"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Page</span>
            <span className="text-2xl font-black text-primary min-w-[1.5ch] text-center">{page}</span>
          </div>

          <button
            onClick={() => {
              setPage((p) => p + 1);
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            disabled={projects.length < limit || loading}
            className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-text hover:bg-primary hover:border-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Next Page"
          >
            <FontAwesomeIcon icon={faChevronRight} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="w-16 h-1 bg-primary/20 rounded-full" />

        <a
          href="https://github.com/HasanAlsaafen"
          target="_blank"
          rel="noreferrer"
          className="bg-black/90 dark:bg-slate-800 text-white rounded-2xl py-4 px-10 no-underline hover:bg-black hover:-translate-y-1 transition-all flex items-center gap-3 font-bold border border-white/10 shadow-xl"
        >
          Explore All Repositories <FontAwesomeIcon icon={faGithub} className="text-lg" />
        </a>
      </div>
    </>
  );
};

export default Projects;
