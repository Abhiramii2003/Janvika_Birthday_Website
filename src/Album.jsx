import { useParams, Link } from "react-router-dom";
import { useState } from "react";

function Album() {
  const { name } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const folderMap = {
    "Cake Cutting": "cake-cutting",
    "Stage Decorations": "decorations",
    "Family Moments": "family",
    "Achan's 75th BDY": "guests",
    "Janu Alone": "janu-alone",
    "Candid Smiles": "candid-smiles",
  };

  const folder = folderMap[name];

  // If album name is wrong
  if (!folder) {
    return (
      <div className="album-page">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h2>Album not found</h2>
      </div>
    );
  }




  // Generate up to 100 photos automatically
  const photos = Array.from({ length: 100 }, (_, i) =>
    `/${folder}/photo${i + 1}.jpg`
  );

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
              onError={(e) =>
                (e.target.closest(".photo-card").style.display = "none")
              }
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