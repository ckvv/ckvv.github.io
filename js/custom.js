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

function debounce(func, wait, immediate) {
  var timer;
  return function() {
    var context = this;
    var args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(function() {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(function() {
        func.apply(context, args)
      }, wait);
    }
  }
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
  if (!document.querySelector('#cusdis_thread')) return;
  await importScript({
    src: '/js/cusdis/cusdis.min.js',
  });
  document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    window.CUSDIS.setTheme(localStorage.getItem('colorscheme'));
  });
}

function autoContents() {
  const contents = document.querySelector('#table-of-contents-wapper');
  if(!contents) return;
  if(!contents.querySelector('ul')) return contents.remove();
  contents.open = window.innerWidth >= 768;
}

function setActive() {
  if(!TableOfContents) return;
  const ele = [...document.querySelector('.content').querySelectorAll('h1,h2,h3')].find((ele)=>{
    return ele.getBoundingClientRect(ele).top >= 0;
  });
  if(ele) {
    const activeA = TableOfContents.querySelector(`.active`);
    if(activeA) activeA.classList.remove('active');
    (TableOfContents.querySelector(`a[href="#${ele.id}"]`) || TableOfContents.querySelector('a')).classList.add('active');
  }
}

// init page event
window.onload = () => {
  initCopyBtn();
  initSearch();
  initComments();
  autoContents();
  setActive();
  window.addEventListener('scroll', debounce(setActive, 200));
};