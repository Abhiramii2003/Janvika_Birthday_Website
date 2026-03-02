import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";

/* ======================================================
   BASE URL (VITE PRODUCTION FIX)
====================================================== */
const BASE = import.meta.env.BASE_URL;

function Album() {
  const { name } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  /* ======================================================
     ALBUM → FOLDER MAP
  ====================================================== */
  const folderMap = {
    "CakeCutting": "cake-cutting",
    "StageDecorations": "decorations",
    "FamilyMoments": "family",
    "Achan75thBDY": "guests",
    "JanuAlone": "janu-alone",
    "CandidSmiles": "candid-smiles",
  };

  const folder = folderMap[name];

  /* ======================================================
     INVALID ALBUM
  ====================================================== */
  if (!folder) {
    return (
      <div className="album-page">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h2>Album not found</h2>
      </div>
    );
  }

  /* ======================================================
     GENERATE IMAGE LIST
     (memoized → better performance)
  ====================================================== */
  const photos = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) =>
      `${BASE}${folder}/photo${i + 1}.jpg`
    );
  }, [folder]);

  /* ======================================================
     IMAGE ERROR HANDLER
     (prevents console spam)
  ====================================================== */
  const hideBrokenImage = (e) => {
    const card = e.currentTarget.closest(".photo-card");
    if (card) card.remove();
  };

  return (
    <div className="album-page">
      <Link to="/" className="back-btn">← Back to Home</Link>

      <h1 className="album-title">{name}</h1>
      <p className="album-subtitle">
        Beautiful memories of Janvika 💖
      </p>

      {/* ================= GRID ================= */}
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div className="photo-card" key={index}>
            <img
              src={photo}
              alt={`Memory ${index + 1}`}
              loading="lazy"
              onClick={() => setSelectedImage(photo)}
              onError={hideBrokenImage}
            />

            <a href={photo} download className="download-btn">
              Download Photo
            </a>
          </div>
        ))}
      </div>

      {/* ================= LIGHTBOX ================= */}
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