const firebaseConfig = {
  apiKey: "AIzaSyBYWG_w6ir80RqN-kd6OecVFwxoDnavbUI",
  authDomain: "deencoin-1b645.firebaseapp.com",
  databaseURL: "https://deencoin-1b645-default-rtdb.firebaseio.com/",
  projectId: "deencoin-1b645"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

document.getElementById("btn-signin").onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("welcome").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("btn-signin").style.display = "none";
    loadTasks(user.uid);
    updateBalance(user.uid);
  }
});

const TASKS = [
  { id: "daily", title: "📅 Daily Check-in", reward: 2, url: "#" },
  { id: "yt_sub", title: "📺 Subscribe YouTube", reward: 10, url: "https://youtube.com" },
  { id: "yt_watch", title: "🎥 Watch YouTube Video", reward: 2, url: "https://youtube.com" },
  { id: "fb_follow", title: "📘 Follow Facebook Page", reward: 10, url: "https://facebook.com" },
  { id: "fb_watch", title: "🎬 Watch Facebook Video", reward: 2, url: "https://facebook.com" },
  { id: "tw_follow", title: "🐦 Follow Twitter", reward: 10, url: "https://twitter.com" },
  { id: "tw_watch", title: "📹 Watch Twitter Video", reward: 2, url: "https://twitter.com" },
  { id: "tg_join", title: "💬 Join Telegram Channel", reward: 10, url: "https://t.me" },
  { id: "tg_group", title: "👥 Join Telegram Group", reward: 10, url: "https://t.me" },
  { id: "site_visit", title: "🌐 Visit Website", reward: 1, url: "https://google.com" }
];

function loadTasks(uid) {
  const container = document.getElementById("tasks");
  container.style.display = "block";
  container.innerHTML = "";
  TASKS.forEach(t => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
      <div>
        <div class="task-title">${t.title}</div>
        <small>+${t.reward} DC</small>
      </div>
      <button class="btn" onclick="doTask('${uid}','${t.id}','${t.url}',${t.reward})">Earn</button>
    `;
    container.appendChild(card);
  });
}

function doTask(uid, taskId, url, reward) {
  const taskRef = db.ref(`users/${uid}/tasks/${taskId}`);
  taskRef.once('value').then(snap => {
    if (snap.exists()) {
      alert("✅ Already Completed");
    } else {
      taskRef.set(true);
      const balRef = db.ref(`users/${uid}/balance`);
      balRef.transaction(current => (current || 0) + reward);
      window.open(url, '_blank');
    }
  });
}

function updateBalance(uid) {
  const balRef = db.ref(`users/${uid}/balance`);
  balRef.on('value', snap => {
    const balance = snap.val() || 0;
    document.getElementById("balance").textContent = `💰 Balance: ${balance} DC`;
  });
}
