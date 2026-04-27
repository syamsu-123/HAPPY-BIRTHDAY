const titleText="Happy Birthday 🎉";
const paragraph1="Selamat ulang tahun! 🎂Semoga makin keren, makin sukses, dan jangan lupa tetap jadi diri sendiri yang seru dan baik hati. Semoga tahun ini lebih banyak tawa daripada drama ya!";
const paragraph2="Semoga di usia yang baru ini kamu diberikan kesehatan, kebahagiaan, rezeki yang lancar, dan selalu dikelilingi orang-orang yang sayang sama kamu.";
const paragraph3="Teruslah jadi pribadi yang kuat, rendah hati, dan penuh semangat. Aku selalu bangga sama kamu. Semoga semua impianmu tercapai dan kamu selalu dikelilingi kebahagiaan.";
const paragraph4="Sekali lagii... Selamat hari ulang tahun ! 🎉 Semoga tahun ini penuh dengan petualangan seru, tawa yang tak berakhir, dan semua hal baik yang kamu impikan. aku selalu ada di sini untuk mendukungmu, jadi jangan ragu untuk berbagi cerita dan momen bahagiamu. Semoga hari spesialmu ini menjadi awal dari babak baru yang penuh kebahagiaan dan kesuksesan! 🎂🎈";
const paragraph5="Sekali lagii... Selamat menuaaa ! 🎉🎂🎈";

const titleElement=document.getElementById("title");
const p1=document.getElementById("p1");
const p2=document.getElementById("p2");
const p3=document.getElementById("p3");
const p4=document.getElementById("p4");
const p5=document.getElementById("p5");

function openLetter(){
  const envelope = document.getElementById("envelope");
  const bgMusic = document.getElementById("bgMusic");
  
  envelope.classList.remove("close");
  envelope.classList.add("open");
  
  // Play music from 59 seconds
  bgMusic.currentTime = 59;
  bgMusic.play().catch(err => console.log("Audio play failed:", err));

  setTimeout(()=>{
    document.getElementById("opening").style.display="none";
    document.getElementById("main-content").style.display="flex";
    typeTitle();
  }, 2500);
}

async function typeTitle() {
  await typeTextPromise(titleText, titleElement, 120, 300);
  await typeTextPromise(paragraph1, p1, 45, 400);
  await typeTextPromise(paragraph2, p2, 45, 400);
  await typeTextPromise(paragraph3, p3, 45, 400);
  await typeTextPromise(paragraph4, p4, 45, 400);
  await typeTextPromise(paragraph5, p5, 45, 0);
}

function typeTextPromise(text, element, speed, delayAfter) {
  return new Promise(resolve => {
    // Array.from memastikan emoji tidak rusak (terpotong) saat diproses satu per satu
    const chars = Array.from(text);
    let i = 0;
    element.innerHTML = "";
    function typing() {
      if (i < chars.length) {
        // Menambahkan teks yang sudah diketik ditambah dengan elemen kursor
        element.innerHTML = chars.slice(0, i + 1).join("") + '<span class="cursor">|</span>';
        i++;
        // Scroll otomatis ke bagian paling bawah halaman
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(typing, speed);
      } else {
        // Menghapus kursor '|' ketika paragraf sudah selesai diketik
        element.innerHTML = text;
        setTimeout(resolve, delayAfter);
      }
    }
    typing();
  });
}
