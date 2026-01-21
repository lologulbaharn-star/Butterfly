const i18n = {
    en: {
        title: "Butterfly Effect 🦋", subtitle: "Small acts that create beautiful changes",
        navTraces: "🦋 Traces", navAuthors: "👥 Authors",
        formH: "💜 Leave Your Trace", submit: "Release the Butterfly 🦋",
        edit: "Edit", delete: "Remove", loading: "Tracing flight...",
        authorsT: "Butterfly Authors 👥", authorsSub: "Click an author to see their traces",
        langBtn: "العربية", confirm: "Delete this trace?"
    },
    ar: {
        title: "أثر الفراشة 🦋", subtitle: "أفعال صغيرة تصنع تغييرات جمالية",
        navTraces: "🦋 الآثار", navAuthors: "👥 المؤلفون",
        formH: "💜 اترك أثرك الجميل", submit: "أطلق الفراشة 🦋",
        edit: "تعديل", delete: "إزالة", loading: "جاري تتبع الأثر...",
        authorsT: "مُطلقو الفراشات 👥", authorsSub: "اضغط على مؤلف لرؤية آثاره",
        langBtn: "English", confirm: "هل تريد حذف هذا الأثر؟"
    }
};

let currentLang = 'en';
let allPosts = []; 
const apiURL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchTraces() {
    toggleLoading(true);
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        allPosts = data.slice(0, 100); 
        renderPosts(allPosts.slice(0, 10)); 
    } catch (error) { alert("Error: " + error.message); }
    finally { toggleLoading(false); }
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = "";
    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'glass-card post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <div class="actions">
                <button class="btn-sm" onclick="updateTrace(${post.id})">${i18n[currentLang].edit}</button>
                <button class="btn-sm" onclick="deleteTrace(${post.id})" style="color:#ff6b6b">${i18n[currentLang].delete}</button>
            </div>`;
        container.appendChild(card);
    });
}


async function fetchAuthors() {
    const container = document.getElementById('authorsContainer');
    if (container.innerHTML !== "") return; 
    
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await res.json();
        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'glass-card author-card';
            div.innerHTML = `<h3>${u.name}</h3><p>${u.email}</p>`;
            
            
            div.onclick = () => {
                showPage('traces');
                const filteredPosts = allPosts.filter(p => p.userId === u.id);
                renderPosts(filteredPosts);
                document.getElementById('subTitle').innerText = `${i18n[currentLang].navTraces} by ${u.name}`;
            };
            
            container.appendChild(div);
        });
    } catch (e) { alert("Error fetching authors"); }
}

function showPage(pageId) {
    document.getElementById('tracesPage').style.display = pageId === 'traces' ? 'block' : 'none';
    document.getElementById('authorsPage').style.display = pageId === 'authors' ? 'block' : 'none';
    document.getElementById('navTraces').classList.toggle('active', pageId === 'traces');
    document.getElementById('navAuthors').classList.toggle('active', pageId === 'authors');
    if(pageId === 'authors') fetchAuthors();
}

document.getElementById('langBtn').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const t = i18n[currentLang];
    document.getElementById('htmlTag').dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('navTraces').innerText = t.navTraces;
    document.getElementById('navAuthors').innerText = t.navAuthors;
    document.getElementById('mainTitle').innerText = t.title;
    document.getElementById('subTitle').innerText = t.subtitle;
    document.getElementById('langBtn').innerText = t.langBtn;
    document.getElementById('formHeading').innerText = t.formH;
    document.getElementById('submitBtn').innerText = t.submit;
    document.getElementById('authorsTitle').innerText = t.authorsT;
    document.getElementById('authorsSubtitle').innerText = t.authorsSub;
    renderPosts(allPosts.slice(0, 10)); 
});

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = { title: document.getElementById('titleInput').value, body: document.getElementById('bodyInput').value, userId: 1 };
    try {
        const res = await fetch(apiURL, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-type': 'application/json; charset=UTF-8' } });
        const newItem = await res.json();
        allPosts.unshift(newItem);
        renderPosts(allPosts.slice(0, 11)); 
        document.getElementById('postForm').reset();
    } catch (e) { alert("Error"); }
});

async function updateTrace(id) {
    const newTitle = prompt("New Title:");
    if (!newTitle) return;
    try {
        await fetch(`${apiURL}/${id}`, { method: 'PUT', body: JSON.stringify({ title: newTitle }), headers: { 'Content-type': 'application/json' } });
        const index = allPosts.findIndex(p => p.id === id);
        if(index !== -1) allPosts[index].title = newTitle;
        renderPosts(allPosts.slice(0, 10));
    } catch (e) { alert("Error"); }
}

async function deleteTrace(id) {
    if (!confirm(i18n[currentLang].confirm)) return;
    try {
        await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
        allPosts = allPosts.filter(p => p.id !== id);
        renderPosts(allPosts.slice(0, 10));
    } catch (e) { alert("Error"); }
}

function initButterflies() {
    const container = document.getElementById('butterfly-container');
    for (let i = 0; i < 15; i++) {
        const b = document.createElement('div');
        b.className = 'butterfly'; b.innerText = '🦋';
        b.style.left = Math.random() * 100 + 'vw';
        b.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(b);
    }
}

function toggleLoading(s) { document.getElementById('loading').innerText = s ? i18n[currentLang].loading : ""; }

initButterflies();
fetchTraces();