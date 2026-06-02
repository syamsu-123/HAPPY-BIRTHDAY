import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Confetti from 'react-confetti';

const titleText = "Happy Birthday 🎉";
const paragraphs = [
  "Selamat ulang tahun! 🎂Semoga makin keren, makin sukses, dan jangan lupa tetap jadi diri sendiri yang seru dan baik hati. Semoga tahun ini lebih banyak tawa daripada drama ya!",
  "Semoga di usia yang baru ini kamu diberikan kesehatan, kebahagiaan, rezeki yang lancar, dan selalu dikelilingi orang-orang yang sayang sama kamu.",
  "Teruslah jadi pribadi yang kuat, rendah hati, dan penuh semangat. Aku selalu bangga sama kamu. Semoga semua impianmu tercapai dan kamu selalu dikelilingi kebahagiaan.",
  "Sekali lagii... Selamat hari ulang tahun ! 🎉 Semoga tahun ini penuh dengan petualangan seru, tawa yang tak berakhir, dan semua hal baik yang kamu impikan. aku selalu ada di sini untuk mendukungmu, jadi jangan ragu untuk berbagi cerita dan momen bahagiamu. Semoga hari spesialmu ini menjadi awal dari babak baru yang penuh kebahagiaan dan kesuksesan! 🎂🎈",
  "Sekali lagii... Selamat menuaaa ! 🎉🎂🎈"
];

const Typewriter = ({ text, speed, onComplete }) => {
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const onCompleteRef = useRef(onComplete);

  // Menyimpan referensi fungsi agar tidak terjadi render ulang yang tak perlu
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const chars = Array.from(text);
    let i = 0;
    let timeoutId;

    // Reset konten untuk mencegah bug penumpukan teks jika komponen dirender ulang
    setContent("");
    setIsTyping(true);

    const timer = setInterval(() => {
      if (i < chars.length) {
        // Dievaluasi secara sinkron untuk menghindari bug closure 'undefined' di akhir teks
        setContent(chars.slice(0, i + 1).join(""));
        i++;
        // Mengurangi frekuensi scroll agar tidak menyebabkan frame drop/lag
        if (i % 3 === 0) window.scrollTo(0, document.body.scrollHeight);
      } else {
        clearInterval(timer);
        setIsTyping(false);
        window.scrollTo(0, document.body.scrollHeight); // Pastikan scroll mentok bawah di akhir
        timeoutId = setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 400); // jeda sebelum lanjut ke paragraf berikutnya
      }
    }, speed);

    return () => {
      clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, speed]);

  return (
    <>
      {content}
      {isTyping && <span className="cursor">|</span>}
    </>
  );
};

const CommentsSection = ({ onShowPopup }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "" || author.trim() === "") {
      onShowPopup("Nama dan pesan tidak boleh kosong ya!");
      return;
    }
    setLoading(true);
    try {
      // Mengirim data ke FormSubmit (akan diteruskan ke email)
      const response = await fetch("https://formsubmit.co/ajax/syamsumaulida1@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Nama: author,
          Pesan: text
        })
      });

      if (response.ok) {
        onShowPopup("Balasanmu berhasil dikirim! 💌");
        setText('');
      } else {
        onShowPopup("Gagal mengirim pesan, coba lagi.");
      }
    } catch (error) {
      console.error("Error sending email: ", error);
      onShowPopup("Gagal mengirim pesan, coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="comments-section">
      <h3>Tinggalkan Balasan 💌</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nama Kamu" required />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis balasanmu di sini..." required />
        <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Balasan'}</button>
      </form>
    </div>
  );
};

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [screenState, setScreenState] = useState('envelope'); // 'envelope', 'candle', 'letter'
  const [typingStage, setTypingStage] = useState(0);
  const audioRef = useRef(null);
  const blowAudioRef = useRef(null);
  const dorAudioRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShowPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    setTimeout(() => {
      setScreenState('candle');
    }, 1000); // Waktu transisi dipercepat karena tidak ada animasi amplop
  };

  const handleBlow = () => {
    // Putar efek suara tiupan
    if (blowAudioRef.current) {
      blowAudioRef.current.play().catch(e => console.log("Blow audio play failed:", e));
    }
    
    // Beri jeda 1 detik agar suara tiupan terdengar sebelum pindah ke surat
    setTimeout(() => {
      setScreenState('letter');
      
      // Putar efek suara ledakan (dor!)
      if (dorAudioRef.current) {
        dorAudioRef.current.play().catch(e => console.log("Dor audio play failed:", e));
      }

      // Tampilkan efek ledakan confetti
      setShowConfetti(true);
      
      // Putar lagu utama setelah lilin ditiup
      if (audioRef.current) {
        audioRef.current.currentTime = 59;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Audio dipanggil langsung dari folder public */}
      <audio ref={audioRef} loop>
        <source src="/Christina Perri - A Thousand Years.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={blowAudioRef}>
        <source src="/blow.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={dorAudioRef}>
        <source src="/dor.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Efek Confetti yang muncul di seluruh layar */}
      {showConfetti && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          recycle={false} 
          numberOfPieces={500} 
        />
      )}

      {screenState === 'envelope' && (
        <div className="opening" id="opening" onClick={handleOpen} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', cursor: 'pointer' }}>
          <style>
            {`
              @keyframes floatAnim {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
              }
            `}
          </style>
          <div style={{
            transform: isOpened ? 'scale(1.2)' : 'scale(1)',
            opacity: isOpened ? 0 : 1,
            transition: 'all 1s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ animation: 'floatAnim 3s ease-in-out infinite' }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
            color: '#ff4d6d',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
            margin: '0 20px',
                textAlign: 'center'
          }}>
            Happy Birthday 🎉
          </h1>
          <p className="open-text" style={{
                marginTop: '20px',
                textAlign: 'center'
          }}>
            Klik layar untuk mulai ✨
          </p>
            </div>
          </div>
        </div>
      )}

      {screenState === 'candle' && (
        <div className="candle-screen">
          <h2 className="candle-text">Tiup dulu lilinnya yaa 🎂</h2>
          <div className="cake-emoji">🎂</div>
          <button onClick={handleBlow} className="blow-btn">Tiup Lilin 💨</button>
        </div>
      )}

      {screenState === 'letter' && (
        <div id="main-content" style={{ display: 'flex' }}>
          <div className="avatar">
            <img src="/hbd.gif" alt="avatar" />
          </div>
          <div className="letter-wrapper">
            <div className="letter-box">
              <h2>
                {typingStage >= 0 && (
                  <Typewriter text={titleText} speed={120} onComplete={() => setTypingStage(1)} />
                )}
              </h2>
              
              {typingStage >= 1 && <p><Typewriter text={paragraphs[0]} speed={45} onComplete={() => setTypingStage(2)} /></p>}
              {typingStage >= 2 && <p><Typewriter text={paragraphs[1]} speed={45} onComplete={() => setTypingStage(3)} /></p>}
              {typingStage >= 3 && <p><Typewriter text={paragraphs[2]} speed={45} onComplete={() => setTypingStage(4)} /></p>}
              {typingStage >= 4 && <p><Typewriter text={paragraphs[3]} speed={45} onComplete={() => setTypingStage(5)} /></p>}
              {typingStage >= 5 && <p><Typewriter text={paragraphs[4]} speed={45} onComplete={() => setTypingStage(6)} /></p>}

              {typingStage >= 6 && (
                <>
                  <div id="contact-links" className="contact-container" style={{ display: 'flex' }}>
                    <a href="https://wa.me/6281313800291" className="contact-btn wa-btn" target="_blank" rel="noreferrer">WhatsApp 💬</a>
                    <a href="https://ig.me/m/syammul_" className="contact-btn ig-btn" target="_blank" rel="noreferrer">Instagram DM 📸</a>
                  </div>
                  <CommentsSection onShowPopup={handleShowPopup} />
                </>
              )}
            </div>
            
            {/* Modal Pop-up dibungkus ke dalam wrapper agar posisinya persis menutupi surat */}
            {showPopup && (
              <div className="popup-overlay" onClick={closePopup}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                  <p>{popupMessage}</p>
                  <button onClick={closePopup} className="popup-close-btn">Tutup</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
