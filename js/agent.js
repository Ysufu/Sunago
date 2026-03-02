/* ============================================
   WARUNG KOPI SUNAGO - agent.js
   AI Agent "Suna" powered by Claude API
   ============================================ */

const SUNAGO_SYSTEM_PROMPT = `Kamu adalah Suna, asisten AI dari Warung Kopi Sunago di Cikampek, Karawang, Jawa Barat.

Kepribadianmu: ramah, santai, ceria seperti barista muda yang asik diajak ngobrol. Pakai bahasa Indonesia yang natural, sesekali campur kata gaul. Jawab singkat tapi informatif. Pakai emoji yang relevan tapi jangan berlebihan.

INFORMASI LENGKAP WARUNG KOPI SUNAGO:
📍 Lokasi: Cikampek, Karawang, Jawa Barat
📸 Instagram: @warungkopi.sunago
🎬 TikTok: @warungkopi.sunago

⏰ JAM BUKA:
- Senin–Jumat: 07.00 – 23.00
- Sabtu: 07.00 – 00.00 (tengah malam)
- Minggu: 08.00 – 22.00

☕ MENU KOPI (Harga PASTI):
- Latte: Rp 15.000 — espresso + steamed milk, creamy dan smooth
- Mocha: Rp 16.000 — espresso + coklat + susu, best seller!
- Butterscotch: Rp 17.000 — kopi + sirup butterscotch karamel, paling unik
- Americano: Rp 14.000 — paling murah, bold dan clean (harga termurah)
- Kopi Susu: Rp 15.000 — kopi robusta + susu segar, favorit pelanggan
- Hazelnut: Rp 16.000 — espresso + sirup hazelnut, nutty dan aromatic
Semua menu tersedia HOT dan ICED.

🧋 NON-COFFEE (estimasi harga):
- Matcha Latte: ~Rp 15.000
- Teh Tarik: ~Rp 8.000
- Es Coklat: ~Rp 10.000
- Susu Segar: ~Rp 8.000

🍽️ MAKANAN & CAMILAN (estimasi harga):
- Indomie Goreng/Kuah: ~Rp 10.000
- Nasi Goreng: ~Rp 15.000
- Roti Bakar: ~Rp 10.000
- Pisang Goreng: ~Rp 8.000

📸 SPOT FOTO:
- Spot A: Meja corner dengan lampu warm, moody & cinematic (foto jam 5 sore!)
- Spot B: Dinding signature logo Sunago, wajib jadi background foto
- Spot C: Area outdoor hijau alami, cocok untuk foto couple/squad
- Spot D: Meja kayu vintage untuk flat lay shot aesthetic
Hashtag: #SunagoCikampek #NgopiSunago #WarkopVibes #FlatlaySunago

✨ FASILITAS:
- WiFi gratis
- Parkir luas
- Area smoking & non-smoking
- Live Music setiap weekend
- Spot foto aesthetic

PANDUAN MENJAWAB:
- Kalau ditanya rekomendasi: sarankan Mocha atau Kopi Susu sebagai best seller, Butterscotch untuk yang mau coba sesuatu yang unik
- Kalau ditanya minuman termurah: Americano Rp 14.000
- Kalau ditanya minuman termahal: Butterscotch Rp 17.000
- Untuk pesan/order: arahkan datang langsung atau DM Instagram @warungkopi.sunago
- Untuk hal di luar warung: tetap ramah, bilang itu di luar pengetahuanmu, tawarkan info warung
- Selalu tutup dengan hangat dan mengundang mereka mampir ke Sunago`;

/* ============================================
   STATE & DOM
   ============================================ */
const agentState = { isOpen: false, isLoading: false, messages: [] };

const aiToggle    = document.getElementById('aiToggle');
const aiPanel     = document.getElementById('aiPanel');
const aiClose     = document.getElementById('aiClose');
const aiMessages  = document.getElementById('aiMessages');
const aiInput     = document.getElementById('aiInput');
const aiSend      = document.getElementById('aiSend');
const aiTyping    = document.getElementById('aiTyping');
const quickReplies = document.getElementById('quickReplies');

/* ============================================
   PANEL TOGGLE
   ============================================ */
function togglePanel() {
  agentState.isOpen = !agentState.isOpen;
  if (agentState.isOpen) {
    aiPanel.classList.add('open');
    setTimeout(() => aiInput && aiInput.focus(), 300);
  } else {
    aiPanel.classList.remove('open');
  }
}

aiToggle && aiToggle.addEventListener('click', togglePanel);
aiClose  && aiClose.addEventListener('click',  togglePanel);

/* ============================================
   MESSAGE RENDERING
   ============================================ */
function appendMessage(role, content) {
  // Remove quick replies on first user message
  if (role === 'user' && quickReplies && quickReplies.parentNode === aiMessages) {
    aiMessages.removeChild(quickReplies);
  }

  const msgEl  = document.createElement('div');
  msgEl.className = `ai-msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.innerHTML = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  msgEl.appendChild(bubble);
  aiMessages.appendChild(msgEl);
  scrollChat();
}

function scrollChat() {
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
function showTyping() { aiTyping.style.display = 'flex'; scrollChat(); }
function hideTyping()  { aiTyping.style.display = 'none'; }

/* ============================================
   CALL CLAUDE API
   ============================================ */
async function callClaude(userMessage) {
  if (agentState.isLoading) return;
  agentState.isLoading = true;

  agentState.messages.push({ role: 'user', content: userMessage });
  appendMessage('user', userMessage);
  showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SUNAGO_SYSTEM_PROMPT,
        messages: agentState.messages,
      }),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const reply = data.content.filter(b => b.type === 'text').map(b => b.text).join('');

    agentState.messages.push({ role: 'assistant', content: reply });
    hideTyping();
    appendMessage('bot', reply);
  } catch (err) {
    console.error('Suna AI error:', err);
    hideTyping();
    appendMessage('bot', 'Waduh, koneksi lagi bermasalah nih 😅 Coba lagi sebentar ya, atau langsung DM kita di <a href="https://www.instagram.com/warungkopi.sunago" target="_blank" style="color:var(--gold)">@warungkopi.sunago</a>!');
  } finally {
    agentState.isLoading = false;
  }
}

/* ============================================
   SEND
   ============================================ */
function sendMessage() {
  const text = aiInput.value.trim();
  if (!text || agentState.isLoading) return;
  aiInput.value = '';
  callClaude(text);
}

aiSend && aiSend.addEventListener('click', sendMessage);
aiInput && aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

/* Quick replies */
quickReplies && quickReplies.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => callClaude(btn.textContent));
});

/* Auto shake hint after 6 seconds */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateY(0)}20%{transform:translateY(-4px)}40%{transform:translateY(2px)}60%{transform:translateY(-3px)}80%{transform:translateY(1px)}}`;
document.head.appendChild(shakeStyle);

setTimeout(() => {
  if (!agentState.isOpen && aiToggle) {
    aiToggle.style.animation = 'shake 0.6s ease, pulse-btn 3s ease-in-out infinite';
  }
}, 6000);
