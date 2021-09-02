// utils
function importScript(params = {}) {
  const el = params.el || document.querySelector('head');
  const src = params.src;
  const oScript = document.createElement("script");
  oScript.type = "text/javascript";
  oScript.src = src;

  return new Promise((resolve, reject) => {
    oScript.onerror = (err) => {
      reject(err);
    };;
    oScript.onload = (event) => {
      resolve(event);
    };
    el.appendChild(oScript);
  });
}

// init copy code
function initCopyBtn() {
  document.querySelectorAll('.highlight').forEach(el => {
    const copyBtn = document.createElement('span');
    copyBtn.innerText = 'Copy';
    copyBtn.classList.add('copy-code-btn');
    el.appendChild(copyBtn);

    copyBtn.onclick = async () => {
      await navigator.clipboard.writeText(el.querySelector('code').innerText);
      copyBtn.classList.add('active-copy-code-btn');
    };
    el.onmouseout = (event) => {
      const s = event.toElement || event.relatedTarget;
      if (el.contains(s)) return;
      copyBtn.classList.remove('active-copy-code-btn');
    }
  });
}

// init 搜索
function initSearch() {
  const searchType = {
    github: 'github',
    google: 'google',
  }

  function searchBy(type) {
    const searchInput = document.querySelector('.search-int');
    let searchLink = '';
    switch (type) {
      case searchType.google:
        searchLink = `https://www.google.com/search?q=site:${window.location.host} ${searchInput.value}`;
        break;
      case searchType.github:
        searchLink = `https://github.com/chenkai0520/chenkai0520.github.io/search?l=Markdown&q=${searchInput.value}`;
        break;
      default:
        return;
    }
    window.open(searchLink, '_blank')
  }

  const searchBtns = document.querySelectorAll('.search-btn');
  if (searchBtns.length === 0) return;
  searchBtns.forEach(el => {
    el.addEventListener('click', () => searchBy(el.dataset.type));
  });

  const searchInput = document.querySelector('.search-int');
  searchInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") searchBy(searchType.github);
  });
}

// init 评论框
async function initComments() {
  if (!document.querySelector('#cusdis_thread')) {
    console.log('not fount el #cusdis_thread');
    return;
  };

  await importScript({
    src: '/js/cusdis/cusdis.min.js',
  });
  document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    window.CUSDIS.setTheme(localStorage.getItem('colorscheme'));
  });
}

// init service-worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

// init page event
window.onload = () => {
  initCopyBtn()
  initSearch();
  initComments();
};