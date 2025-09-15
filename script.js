const blogList = document.querySelector('.blog-list');
const searchBox = document.getElementById('searchBox');
const tagFilter = document.getElementById('tagFilter');
let allPosts = [];
let selectedTag = null;

// 読み込みんところ。
fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    allPosts = posts;
    renderTagButtons(posts);
    renderPosts(posts);
  })
  .catch(err => {
    blogList.innerHTML = "<p>ブログを読み込めませんでした。</p>";
    console.error(err);
  });

// コメントなら何を書いてもゆるされのかな
function renderPosts(posts) {
  blogList.innerHTML = "";
  if (posts.length === 0) {
    blogList.innerHTML = "<p>該当する記事はありません。</p>";
    return;
  }
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <img src="${post.thumbnail}" alt="${post.title}" class="blog-thumb">
      <h3>${post.title}</h3>
      <p>${post.date}</p>
      <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>
    `;
    card.onclick = () => location.href = post.file;
    blogList.appendChild(card);
  });
}

// 検索するとこ
searchBox.addEventListener('input', filterPosts);

// 最近キーボードを英語配列に変えてまだ慣れない
function renderTagButtons(posts) {
  const tags = new Set();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  tagFilter.innerHTML = '';
  Array.from(tags).forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-button';
    btn.textContent = tag;
    btn.onclick = () => {
      selectedTag = selectedTag === tag ? null : tag;
      Array.from(tagFilter.children).forEach(b => b.classList.remove('active'));
      if (selectedTag) btn.classList.add('active');
      filterPosts();
    };
    tagFilter.appendChild(btn);
  });
}

// 検索＋タグフィルター
function filterPosts() {
  const keyword = searchBox.value.toLowerCase();
  let filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.date.toLowerCase().includes(keyword)
  );
  if (selectedTag) {
    filtered = filtered.filter(post => post.tags.includes(selectedTag));
  }
  renderPosts(filtered);
}

