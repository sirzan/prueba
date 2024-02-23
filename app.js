document.addEventListener('DOMContentLoaded', function () {

    const newsApiKey = '261f420e5ffe4743b80ee8c493513f31'; // clave de API de NewsAPI.org
    const randomUserApiKey = 'GZSL-IF0W-X4KM-FJC6'; // clave de API de Random User

    const pageSize = 10; // Tamaño de la página
    let currentPage = 1;

    fetchNews(currentPage);

    function fetchNews(page) {
        const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}&pageSize=${pageSize}&page=${page}`;

        fetch(newsApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    const articles = data.articles;
                    fetchAuthors(articles);
                    displayPagination(data.totalResults);
                } else {
                    console.error('Error al obtener las noticias:', data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener las noticias:', error);
            });
    }

    function fetchAuthors(articles) {
        const authorPromises = articles.map(article => {
            return fetch(`https://randomuser.me/api/?key=${randomUserApiKey}&nat=us`)
                .then(response => response.json())
                .then(data => {
                    const user = data.results[0];
                    return {
                        ...article,
                        author: `${user.name.first} ${user.name.last}`
                    };
                });
        });

        //ENVIAR DATA AL DOM
        Promise.all(authorPromises)
            .then(articlesWithAuthors => {
                displayNews(articlesWithAuthors);
            })
            .catch(error => {
                console.error('Error al obtener los autores:', error);
            });
    }

    //MOSTRAR RESULTADOS EN PANTALLA

    function displayNews(articles) {
        const newsContainer = document.getElementById('news');
        newsContainer.innerHTML = '';

        articles.forEach(article => {
            const newsItem = `
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-header">
                        Author: ${article.author}
                    </div>
                    <img src="${article.urlToImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description}</p>
                        <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
                    </div>
                </div>
                </div>
            `;
            newsContainer.innerHTML += newsItem;
        });
    }

    //PAGINACIÓN
    function displayPagination(totalResults) {
        const totalPages = Math.ceil(totalResults / pageSize);
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');

            if (i === currentPage) {
                li.classList.add('active');
            }

            const a = document.createElement('a');

            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;

            a.addEventListener('click', () => {
                currentPage = i;
                fetchNews(currentPage);
                updatePagination();
            });

            li.appendChild(a);

            paginationContainer.appendChild(li);

        }
    }

      //PAGINACIÓN ACTIVE

    function updatePagination() {
        const paginationItems = document.querySelectorAll('.pagination .page-item');
        paginationItems.forEach(item => {
            item.classList.remove('active');
            const pageNumber = parseInt(item.textContent);
            if (pageNumber === currentPage) {
                item.classList.add('active');
            }
        });
    }
});