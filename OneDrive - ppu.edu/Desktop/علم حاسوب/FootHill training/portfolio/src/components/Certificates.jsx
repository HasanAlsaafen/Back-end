import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight, 
  faCertificate, 
  faCheckCircle,
  faChevronLeft,
  faChevronRight 
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const CertificateCard = ({ certificate }) => {
  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row max-w-2xl w-full">
      <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <img
          src={certificate.image}
          alt={certificate.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-sm shadow-sm"
        />
        <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <FontAwesomeIcon icon={faCheckCircle} /> VERIFIED
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <FontAwesomeIcon icon={faCertificate} className="text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Professional Certification</span>
          </div>
          <h3 className="text-lg font-bold text-text mb-2 leading-tight group-hover:text-primary transition-colors">
            {certificate.title}
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            <strong>Issuer:</strong> {certificate.issyuer}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
            {certificate.description}
          </p>
        </div>

        <div className="flex justify-end">
          <a
            href={certificate.credentialURL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700 transition-colors group/link"
          >
            Verify Credential 
            <FontAwesomeIcon icon={faArrowRight} className="group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4;

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/certificates?limit=${limit}&page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch certificates");
      const data = await response.json();
      setCertificates(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [page]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="ml-4 md:ml-0">
            <h2
              className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 before:content-[''] before:w-8 before:h-[1px] before:bg-primary/30"
              id="certificates"
            >
              Accreditations
            </h2>
            <h3 className="text-4xl font-extrabold text-text leading-tight">
              Verified <span className="text-primary">Certifications</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl text-lg font-medium">
              Showcasing my commitment to continuous learning and mastery of modern web technologies.
            </p>
          </div>

          <a
            href="https://linkedin.com/in/hasan-saafen-9ba5902b5"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-sm self-center md:self-end"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
            <span className="hidden sm:inline">Connect on LinkedIn</span>
          </a>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading certificates...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
            <p className="font-bold mb-2">Error loading certificates</p>
            <p>{error}</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border flex flex-col items-center">
            <p className="text-gray-500 font-medium mb-4">No certificates found.</p>
          </div>
        ) : (
          <>
            <section
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center"
              aria-labelledby="certificates"
            >
              {certificates.map((cert) => (
                <CertificateCard key={cert._id} certificate={cert} />
              ))}
            </section>

            <div className="flex flex-col items-center gap-4 pt-12">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-primary hover:text-white disabled:opacity-30 transition-all group"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Page
                  </span>
                  <span className="text-xl font-black text-primary">
                    {page}
                  </span>
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={certificates.length < limit || loading}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-primary hover:text-white disabled:opacity-30 transition-all group"
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;

