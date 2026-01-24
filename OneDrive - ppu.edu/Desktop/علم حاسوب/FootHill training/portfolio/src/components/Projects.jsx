import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";

const techColors = {
  typescript: "bg-[#3178c6] text-white",     
  javascript: "bg-[#f7df1e] text-black",

  react: "bg-[#61dafb] text-black",
  tailwind: "bg-[#06b6d4] text-white",       
  html: "bg-[#e34f26] text-white",
  css: "bg-[#1572b6] text-white",

  formik: "bg-[#2563eb] text-white",          

  jest: "bg-[#99425b] text-white",             
  reactTesting: "bg-[#e11d48] text-white",     
  msw: "bg-[#ff6a33] text-white",              

  firebase: "bg-[#ffca28] text-black",
  mysql: "bg-[#00758f] text-white",
  php: "bg-[#777bb4] text-white",
  java: "bg-[#007396] text-white",
  "node.js": "bg-[#339933] text-white",           
  express: "bg-[#000000] text-white",   
  seo: "bg-green-500/80 text-black",
  bootstrab: "bg-[#7952b3] text-white",
  "react testing": "bg-[#e11d48] text-white", 

};






const ProjectCard = ({ project }) => {


  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-border">
      <div className="relative overflow-hidden">
        <a href={project.link} target={project.target} title="Tap to see">
          <img
            src={project.imageUrl}
            alt={project.imageAlt}
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
              className={`inline-block rounded-full py-1 px-3 text-xs font-medium ${
                techColors[tech.toLowerCase()] || "bg-gray-200 text-black"
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.github}
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 3;

  useEffect(() => {
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
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page]);
    console.log(projects);
  const projectData = [
    {
      id: "aztech-website",
      title: "Aztech Website",
      link: "https://aztech-ksa.com/",
      target: "_AztechProject",
      image: "/assets/images/aztech-project.png",
      imageAlt: "Snapshot from the site",
      description:
        "This was the first real-world project I worked on, and it marked a significant step in my journey as a front-end developer. It was built entirely with React and deployed using Firebase, linked to the company's custom domain. I also integrated an email subscription service through the contact form.",
      technologies: ["React", "Firebase", "SEO", "CSS", "Bootstrab", "JavaScript"],
      github: "https://github.com/HasanAlsaafen/Aztech-New",
    },
    {
      id: "news-website",
      title: "News Website",
      link: "/assets/images/news-project.png",
      target: "_NewsSite",
      image: "/assets/images/news-project.png",
      imageAlt: "Snapshot from the news site",
      description:
        "This was the final project for the Web Programming course, where we were required to build a dynamic, web-based application for displaying news articles. The app included user authentication and role-based authorization using the WAMP stack.",
      technologies: ["JavaScript", "PHP", "HTML", "CSS", "Bootstrab", "Mysql"],
      github: "https://github.com/HasanAlsaafen/Aztech-New",
    },
    {
      id: "cocktail-project",
      title: "Cocktail Maker Project",
      link: "/assets/images/Java.png",
      target: "_JavaProject",
      image: "/assets/images/Java.png",
      imageAlt: "Snap from the main in my java project",
      description:
        "This project was the final assignment for the Object-Oriented Programming course. It focused on applying core OOP principles using Java with encapsulation, inheritance, and polymorphism. The GUI was designed using NetBeans.",
      technologies: ["Java"],
      github: "https://github.com/HasanAlsaafen/JavaProject-cocktail-",
    },
  ];

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
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-500 font-bold mb-2">Error loading projects</p>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={() => setPage(page)} 
              className="mt-4 text-primary underline font-medium"
            >
              Try again
            </button>
          </div>
        ) : projects.length > 0 ? (
          projects.map((proj) => (
            <ProjectCard key={proj._id || proj.id} project={proj} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            No projects found for this page.
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
