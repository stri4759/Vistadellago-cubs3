import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const API_URL = '/api';

const firebaseConfig = {
  apiKey: "AIzaSyDdjzIc2912UTxZSkhgkwnUZ1E2sJlwuM8",
  authDomain: "vista-club-directory-c86e1.firebaseapp.com",
  projectId: "vista-club-directory-c86e1",
  storageBucket: "vista-club-directory-c86e1.firebasestorage.app",
  messagingSenderId: "460970758623",
  appId: "1:460970758623:web:3c07b691e4875adb64346a",
  measurementId: "G-VH0NGQV0K1"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let allClubs = [];
let allTags = [];
let selectedTags = [];
let currentUser = null;

async function fetchClubs() {
    const loading = document.getElementById('loading');
    const clubsContainer = document.getElementById('clubs-container');
    
    loading.style.display = 'block';
    clubsContainer.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/get-clubs-list`);
        const data = await response.json();
        allClubs = typeof data === 'string' ? JSON.parse(data) : data;
        displayClubs(allClubs);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        clubsContainer.innerHTML = '<p>Error loading clubs. Make sure the backend is running.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

async function fetchTags() {
    try {
        const response = await fetch(`${API_URL}/get-all-tags`);
        const data = await response.json();
        const tagsData = typeof data === 'string' ? JSON.parse(data) : data;
        allTags = tagsData.filter(tag => tag && tag !== 'null');
        displayTags(allTags);
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
}

async function fetchClubsByTags(tags) {
    if (tags.length === 0) {
        displayClubs(allClubs);
        return;
    }
    
    const loading = document.getElementById('loading');
    const clubsContainer = document.getElementById('clubs-container');
    
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`${API_URL}/get-clubs-by-tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tags })
        });
        const data = await response.json();
        const clubs = typeof data === 'string' ? JSON.parse(data) : data;
        displayClubs(clubs);
    } catch (error) {
        console.error('Error fetching filtered clubs:', error);
        clubsContainer.innerHTML = '<p>Error loading filtered clubs.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

function displayTags(tags) {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.onclick = () => toggleTag(tag, tagElement);
        tagsContainer.appendChild(tagElement);
    });
}

function toggleTag(tag, element) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        element.classList.remove('active');
    } else {
        selectedTags.push(tag);
        element.classList.add('active');
    }
    
    fetchClubsByTags(selectedTags);
}

function displayClubs(clubs) {
    const clubsContainer = document.getElementById('clubs-container');
    clubsContainer.innerHTML = '';
    
    if (clubs.length === 0) {
        clubsContainer.innerHTML = '<p>No clubs found matching the selected tags.</p>';
        return;
    }
    
    clubs.forEach(club => {
        const clubCard = document.createElement('div');
        clubCard.className = 'club-card';
        
        if (club['Gold Standard']) {
            clubCard.classList.add('gold-standard');
        }
        if (club['Club Highlight']) {
            clubCard.classList.add('highlight');
        }
        
        const tagsHtml = Array.isArray(club.Tags) 
            ? club.Tags.filter(t => t && t !== 'null').map(tag => 
                `<span class="club-tag">${tag}</span>`
              ).join('')
            : '';
        
        clubCard.innerHTML = `
            <h3>${club['Club Name'] || 'Unnamed Club'}</h3>
            <p class="club-description">${club['Club Description'] || 'No description available'}</p>
            <div class="club-details">
                ${club.President && club.President !== 'null' ? `<p><strong>President:</strong> ${Array.isArray(club.President) ? club.President.join(', ') : club.President}</p>` : ''}
                ${club.Advisor && club.Advisor !== 'null' ? `<p><strong>Advisor:</strong> ${club.Advisor}</p>` : ''}
                ${club['Meeting Times'] && club['Meeting Times'] !== 'null' ? `<p><strong>Meeting Times:</strong> ${club['Meeting Times']}</p>` : ''}
                ${club['Meeting Room'] && club['Meeting Room'] !== 'null' ? `<p><strong>Room:</strong> ${club['Meeting Room']}</p>` : ''}
                ${club['Email Address'] && club['Email Address'] !== 'null' ? `<p><strong>Email:</strong> ${club['Email Address']}</p>` : ''}
            </div>
            ${tagsHtml ? `<div class="club-tags">${tagsHtml}</div>` : ''}
        `;
        
        clubsContainer.appendChild(clubCard);
    });
}

async function handleLogin() {
    try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        
        const response = await fetch(`${API_URL}/login-google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken })
        });
        
        const data = await response.json();
        console.log('Login successful:', data);
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

function updateAuthUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = user.displayName || user.email;
        currentUser = user;
    } else {
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        currentUser = null;
    }
}

document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('clear-filters').addEventListener('click', () => {
    selectedTags = [];
    document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
    displayClubs(allClubs);
});

onAuthStateChanged(auth, updateAuthUI);

fetchClubs();
fetchTags();
