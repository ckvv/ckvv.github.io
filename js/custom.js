// copy code

function initCopyBtn () {
  document.querySelectorAll('pre').forEach(el => {
    const copyBtn = document.createElement('span');
    copyBtn.innerText = 'Copy';
    el.onclick = async() => {
      await navigator.clipboard.writeText(el.innerText);
      copyBtn.innerText = 'Copyed';
    };

    el.onmouseover = () => {
      copyBtn.classList.remove('copyed-code-btn');
      copyBtn.classList.add('copy-code-btn');
      el.appendChild(copyBtn);
    };

    el.onmouseout = (event) => {
      const s = event.toElement || event.relatedTarget;
      if (el.contains(s)) return;
      copyBtn.classList.remove('copy-code-btn');
      copyBtn.classList.add('copyed-code-btn');
      copyBtn.innerText = 'Copy';
      el.removeChild(copyBtn);
    }
  });
}
// utils
function importScript(params = {}) {
  const el = params.el || document.querySelector('head');
  const src = params.src;
  const oScript = document.createElement("script");
  oScript.type = "text/javascript";
  oScript.src = src;

  return new Promise((resolve,reject) => {
    oScript.onerror = (err) => {
      reject(err);
    };;
    oScript.onload = (event) => {
      resolve(event);
    };
    el.appendChild(oScript);
  });
}

// init 搜索
function initSearch() {
  const searchType = {
    github: 'github',
    google: 'google',
  }
  function searchBy(type){
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
  if(searchBtns.length === 0) return;
  searchBtns.forEach(el => {
    el.addEventListener('click', () => searchBy(el.dataset.type));
  });

  const searchInput = document.querySelector('.search-int');
  searchInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") searchBy(searchType.github);
  });
}

// init 评论框
async function initValine() {
  if(!document.querySelector('#vcomments')) {
    console.warn('not fount el #vcomments');
    return;
  };

  await importScript({
    src: '/js/valine.min.js',
  });
  new Valine({
    el: '#vcomments',
    appId: '87IC4ccx5EotHkYSpD0xCJmO-gzGzoHsz',
    appKey: 'jDUTsuflq3tG1bYIMquqixA2'
  });
}


// init page event
window.onload = () => {
  initCopyBtn()
  initSearch();
  initValine();
};