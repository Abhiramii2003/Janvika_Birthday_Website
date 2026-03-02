import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Album from "./Album";

function Puzzle() {
  const size = 3;
  const image = "/janvika.jpg";
  const winSound = "/baby-laugh.mp3";

  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);

  useEffect(() => {
    createPuzzle();
  }, []);

  const createPuzzle = () => {
    const arr = Array.from({ length: size * size }, (_, i) => i);
    arr.sort(() => Math.random() - 0.5);
    setPieces(arr);
    setSolved(false);
    setDraggingIndex(null);
  };

  // ---------------- Drag Start ----------------
  const handlePointerDown = (e, index) => {
    e.preventDefault();
    setDraggingIndex(index);
  };

  // ---------------- Drag Over ----------------
  const handlePointerMove = (e) => {
    if (draggingIndex === null) return;

    const pointerX = e.clientX ?? e.touches?.[0].clientX;
    const pointerY = e.clientY ?? e.touches?.[0].clientY;

    document.querySelectorAll(".piece").forEach((piece, i) => {
      const rect = piece.getBoundingClientRect();
      if (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom &&
        i !== draggingIndex
      ) {
        // Swap with the piece currently under finger
        swapPieces(draggingIndex, i);
        setDraggingIndex(i); // continue dragging from new piece
      }
    });
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
  };

  const swapPieces = (from, to) => {
    const newPieces = [...pieces];
    [newPieces[from], newPieces[to]] = [newPieces[to], newPieces[from]];
    setPieces(newPieces);
    checkSolved(newPieces);
  };

  const checkSolved = (arr) => {
    if (arr.every((val, i) => val === i)) {
      setSolved(true);
      new Audio(winSound).play().catch(() => {});
      launchConfetti();
    }
  };

  const launchConfetti = () => {
    const end = Date.now() + 2000;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      const confetti = document.createElement("div");
      confetti.className = "burst-confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        ["#ffb6c1", "#ffd6e0", "#ffc2d1", "#ffe5ec"][
          Math.floor(Math.random() * 4)
        ];
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }, 50);
  };

  return (
    <section className="puzzle-section">
      <h2>🧩 Solve Janvika's Puzzle</h2>
      <p>Drag on desktop & mobile 💻📱</p>

      <div
        className="puzzle-container"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            className="piece"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: `${
                -(piece % size) * 120
              }px ${-Math.floor(piece / size) * 120}px`,
            }}
            onPointerDown={(e) => handlePointerDown(e, index)}
          />
        ))}
      </div>

      <button className="shuffle-btn" onClick={createPuzzle}>
        Shuffle 🔄
      </button>

      {solved && <div className="win-message">🎉 You Solved It! 💕 Amazing Job!</div>}
    </section>
  );
}

/* ======================================================
   BLOW CANDLES
====================================================== */
function BlowCandles() {
  const winSound = "/baby-laugh.mp3";

  const [candles, setCandles] = useState(
    Array.from({ length: 5 }, () => ({ on: true, smoke: false }))
  );
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    startMicDetection();
  }, []);

  const blowOneCandle = () => {
    const newCandles = [...candles];
    const index = newCandles.findIndex((c) => c.on);

    if (index !== -1) {
      newCandles[index] = { on: false, smoke: true };
      setCandles(newCandles);

      setTimeout(() => {
        newCandles[index].smoke = false;
        setCandles([...newCandles]);
      }, 2000);

      if (newCandles.every((c) => !c.on)) celebrate();
    }
  };

  const celebrate = () => {
    setFinished(true);
    new Audio(winSound).play();
  };

  const startMicDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      mic.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume =
          dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (volume > 40) blowOneCandle();
        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      console.log("Mic not allowed");
    }
  };

  return (
    <section className={`cake-section ${finished ? "dark-mode" : ""}`}>
      <h2>🎂 A Special Celebration 🎉</h2>

      <div className="cake-3d">
        {candles.map((candle, index) => (
          <div
            key={index}
            className="candle-stick"
            onClick={blowOneCandle}
          >
            {candle.on && <div className="flame"></div>}
            {candle.smoke && <div className="smoke"></div>}
          </div>
        ))}

        <div className="cake-layer layer-top"></div>
        <div className="cake-layer layer-middle"></div>
        <div className="cake-layer layer-bottom"></div>
      </div>

      {finished && (
        <div className="final-reveal">
          <img src="/photo13.jpg" alt="Janvika Special" />
          <div className="glow-ring"></div>
        </div>
      )}
    </section>
  );
}

/* ======================================================
   HOME
====================================================== */
function Home() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const sparkle = (e) => {
      const star = document.createElement("div");
      star.className = "sparkle";
      star.style.left = e.clientX + "px";
      star.style.top = e.clientY + "px";
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 800);
    };

    window.addEventListener("mousemove", sparkle);
    return () =>
      window.removeEventListener("mousemove", sparkle);
  }, []);

  const toggleMusic = () => {
    if (!playing) audioRef.current.play();
    else audioRef.current.pause();
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />

      <button className="music-btn" onClick={toggleMusic}>
        {playing ? "🔊 Music On" : "🔈 Music Off"}
      </button>

      <div className="hero">

  {/* 🎈 Floating Balloons */}
  <div className="hero">


  {/* Floating Clouds */}
  <div className="cloud cloud1"></div>
  <div className="cloud cloud2"></div>

  <div className="balloons">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="balloon"></div>
    ))}
  </div>

  <div className="hearts">
    {Array.from({ length: 15 }).map((_, i) => (
      <span key={i}>💖</span>
    ))}
  </div>

  <div className="overlay fade-in">
    <h1 className="name floating-name">
      Janvika Meera Sujith
    </h1>
    <p className="tagline">Our Little Janu</p>
    <p className="subtitle">Born on 16 February 2025</p>
  </div>
</div>
</div>

      {/* ABOUT */}
      <section className="about royal-poem">
        <h2 className="poem-title">
          ✨ Our Little Miracle ✨
        </h2>

        <div className="poem">
          <p>When dawn first kissed the silent sky,</p>
          <p>Thou cam’st, a star from realms above;</p>
          <p>And in thy tender, moonlit sigh</p>
          <p>Awoke our hearts to boundless love.</p>

          <br />

          <p>So small thy hand, yet vast thy grace,</p>
          <p>A kingdom rests within thine eyes;</p>
          <p>In every smile, heaven’s trace,</p>
          <p>In every breath, new joys arise.</p>

          <br />

          <p>
            O gentle bloom of February fair,<br />
            Thou art our hope, our light, our prayer. 💖
          </p>
        </div>
      </section>

    <section className="gallery">
        <h2>Beautiful Moments</h2>

        <div className="albums">
          <Link to="/album/CakeCutting" className="album-card">
            Cake Cutting 🎂
          </Link>
          <Link to="/album/FamilyMoments" className="album-card">
            Family Moments 💖
          </Link>
          <Link to="/album/Janu" className="album-card">
            Janu  🌸
          </Link>
          <Link to="/album/CandidSmiles" className="album-card">
            Candid Smiles 😊
          </Link>
          <Link to="/album/StageDecorations" className="album-card">
            Stage Decorations 🎀
          </Link>
          <Link to="/album/Achan75thBDY" className="album-card">
            Achan's 75th BDY ✨
          </Link>
        </div>
      </section>


      <Puzzle />
      <BlowCandles />
    </>
  );
}

/* ======================================================
   ROUTES
====================================================== */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/album/:name" element={<Album />} />
    </Routes>
  );
}

export default App;