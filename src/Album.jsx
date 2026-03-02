import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";

const BASE = import.meta.env.BASE_URL;

/* ======================================================
   LOAD ALL IMAGES AT BUILD TIME (VITE SAFE)
====================================================== */
const allImages = import.meta.glob(
  "/public/**/*.jpg",
  { eager: true }
);

function Album() {
 const { name } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const folderMap = {
    CakeCutting: "cake-cutting",
    StageDecorations: "decorations",
    FamilyMoments: "family",
    Achan75thBDY: "guests",
    Janu: "janu",
    CandidSmiles: "candid-smiles",
  };

  const folder = folderMap[name];

  if (!folder) {
    return (
      <div className="album-page">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h2>Album not found</h2>
      </div>
    );
  }

  /* ======================================================
     FILTER ONLY CURRENT ALBUM IMAGES
  ====================================================== */
  const photos = useMemo(() => {
    return Object.keys(allImages)
      .filter((path) => path.includes(`/public/${folder}/`))
      .map((path) => path.replace("/public/", BASE));
  }, [folder]);

  return (
    <div className="album-page">
      <Link to="/" className="back-btn">← Back to Home</Link>

      <h1 className="album-title">{name}</h1>
      <p className="album-subtitle">
        Beautiful memories of Janvika 💖
      </p>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div className="photo-card" key={index}>
            <img
              src={photo}
              alt={`Memory ${index + 1}`}
              loading="lazy"
              onClick={() => setSelectedImage(photo)}
            />

            <a href={photo} download className="download-btn">
              Download Photo
            </a>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Album;