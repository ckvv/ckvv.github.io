function initSearch() {
  const searchType = {
    github: 'github',
    google: 'google',
  }
  function searchBy(type){
    const searchInput = document.querySelector('#search-int');
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
  const searchGoogleBtn = document.querySelector('#search-by-google-btn');
  if(searchGoogleBtn) searchGoogleBtn.addEventListener('click', () => searchBy(searchType.google));

  const searchGithubBtn = document.querySelector('#search-by-github-btn');
  if(searchGithubBtn) searchGithubBtn.addEventListener('click', () => searchBy(searchType.github));

  const searchInput = document.querySelector('#search-int');
  if(searchInput) {
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === "Enter") searchBy(searchType.github);
    });
  }
}

function initValine() {
  new Valine({
      el: '#vcomments',
      appId: '87IC4ccx5EotHkYSpD0xCJmO-gzGzoHsz',
      appKey: 'jDUTsuflq3tG1bYIMquqixA2'
  });
}

(()=>{
  initSearch();
  initValine();
})();