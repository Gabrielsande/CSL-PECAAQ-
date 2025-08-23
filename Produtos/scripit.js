// Define uma constante para o número de produtos por página.
const PRODUCTS_PER_PAGE = 8;
// Variável para rastrear a página atual, começando em 1.
let currentPage = 1;
// Array que armazena todos os produtos disponíveis.
let products = [];
// Array que armazena os produtos após a aplicação dos filtros.
let filtered = [];
// Conjunto (Set) para armazenar marcas únicas, garantindo que não haja duplicatas.
let brandsSet = new Set();
// Conjunto (Set) para armazenar categorias únicas.
let categoriesSet = new Set();

// Adiciona um listener que dispara a função quando o DOM (Document Object Model) estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    // Declarações de constantes para obter elementos HTML pelo ID.
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const brandList = document.getElementById('brandList');
    const categoryList = document.getElementById('categoryList');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const showMoreBrands = document.getElementById('showMoreBrands');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const applyPrice = document.getElementById('applyPrice');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');

    // Chamadas de funções iniciais para configurar a página.
    createSampleProducts(); // Cria um array de produtos de exemplo.
    populateFilterSets(); // Popula os conjuntos de marcas e categorias com base nos produtos.
    renderFilterCheckboxes(); // Renderiza os checkboxes de filtro na barra lateral.
    applyFiltersAndRender(); // Aplica os filtros iniciais e renderiza os produtos.

    // Adiciona um listener para o seletor de ordenação. Quando a ordenação muda, a página volta para a 1 e os filtros são reaplicados.
    sortSelect.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    // Adiciona listeners para os checkboxes de 'Oportunidades'.
    document.querySelectorAll('[data-filter="opportunity"]').forEach(el => el.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); }));

    // Variável para controlar o "debounce" (atraso) na busca.
    let debounceTimer;
    // Adiciona um listener para a barra de busca, para que a busca não seja acionada a cada tecla digitada, mas sim após um pequeno atraso.
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer); // Limpa o timer anterior se uma nova tecla for digitada.
        const q = e.target.value.trim().toLowerCase(); // Obtém o valor da busca, remove espaços e converte para minúsculas.
        // Inicia um novo timer.
        debounceTimer = setTimeout(() => {
            renderSuggestions(q); // Renderiza as sugestões de busca.
            currentPage = 1; // Volta para a primeira página.
            applyFiltersAndRender(); // Aplica os filtros e renderiza os produtos.
        }, 220); // Tempo de atraso em milissegundos.
    });

    // Adiciona um listener para as sugestões de busca.
    suggestions.addEventListener('click', (ev) => {
        // Verifica se o clique foi em um item da lista.
        if (ev.target.matches('li')) {
            searchInput.value = ev.target.textContent; // Preenche o campo de busca com o texto da sugestão.
            suggestions.classList.add('hidden'); // Esconde a lista de sugestões.
            currentPage = 1; // Volta para a primeira página.
            applyFiltersAndRender(); // Aplica os filtros com o novo termo de busca.
        }
    });

    // Adiciona listeners para os filtros de marca e categoria.
    brandList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    categoryList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });

    // Adiciona um listener para o botão "Ver mais/Ver menos" de marcas.
    showMoreBrands.addEventListener('click', () => {
        // Alterna o estado de "expandido" do dataset.
        showMoreBrands.dataset.expanded = showMoreBrands.dataset.expanded === '1' ? '0' : '1';
        renderFilterCheckboxes(); // Renderiza os checkboxes de marca novamente com o novo limite.
    });

    // Adiciona um listener para o botão "Aplicar" de preço.
    applyPrice.addEventListener('click', () => { currentPage = 1; applyFiltersAndRender(); });

    // Adiciona um listener para o botão "Anterior" da paginação.
    prevPage.addEventListener('click', () => {
        if (currentPage > 1) { // Verifica se não estamos na primeira página.
            currentPage--; // Decrementa a página atual.
            renderProducts(); // Renderiza os produtos da nova página.
        }
    });
    // Adiciona um listener para o botão "Próximo" da paginação.
    nextPage.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE)); // Calcula o número total de páginas.
        if (currentPage < totalPages) { // Verifica se não estamos na última página.
            currentPage++; // Incrementa a página atual.
            renderProducts(); // Renderiza os produtos da nova página.
        }
    });

    // Adiciona um listener para o botão do WhatsApp.
    document.getElementById('whatsappBtn').addEventListener('click', () => {
        // Abre uma nova janela para o link do WhatsApp com uma mensagem pré-definida.
        const url = "https://wa.me/5511999999999?text=Ol%C3%A1%20Pe%C3%A7aAq%2C%20gostaria%20de%20ajuda%20com%20uma%20pe%C3%A7a";
        window.open(url, '_blank');
    });

    // Array para armazenar os itens do carrinho de compras.
    let cart = [];
    // Função para adicionar um produto ao carrinho.
    function addToCart(p) {
        cart.push(p); // Adiciona o produto ao array do carrinho.
        cartCount.textContent = cart.length; // Atualiza o contador de itens no carrinho.
        alert(`Produto "${p.title}" adicionado ao carrinho!`); // Exibe um alerta de confirmação.
    }

    // Função para criar dados de produtos de exemplo.
    function createSampleProducts() {
        // Array de objetos, onde cada objeto é um produto com suas propriedades.
        products = [
            {
                id: 1,
                title: "Filtro de Ar Honda Civic 2010",
                brand: "Honda",
                category: "Filtro",
                price: 120.00,
                model: "Civic 2010",
                image: "img/FiltrodeArHondaCivi2010.jpg",
                parcels: 3,
                opportunity: true,
                addedAt: Date.now() - 1000000 // Cria uma data de adição fictícia.
            },
            {
                id: 2,
                title: "Pastilha de Freio Bosch - Gol 2015",
                brand: "Bosch",
                category: "Freios",
                price: 250.50,
                model: "Gol 2015",
                image: "img/PastilhaFreioBoschGol2015.jpg",
                parcels: 5,
                opportunity: false,
                addedAt: Date.now() - 2000000
            },
            {
                id: 3,
                title: "Óleo Lubrificante Shell 5W30",
                brand: "Shell",
                category: "Óleo",
                price: 95.90,
                model: "Universal",
                image: "img/OleoLubrificanteShell5W30.jpg",
                parcels: 2,
                opportunity: true,
                addedAt: Date.now() - 3000000
            },
            {
                id: 4,
                title: "Bateria Moura 60Ah",
                brand: "Moura",
                category: "Bateria",
                price: 480.00,
                model: "Universal",
                image: "img/BateriaMoura60Ah.jpg",
                parcels: 6,
                opportunity: false,
                addedAt: Date.now() - 4000000
            },
            {
                id: 5,
                title: "Filtro de Óleo Fram",
                brand: "Fram",
                category: "Filtro",
                price: 45.30,
                model: "Universal",
                image: "img/FiltrodeOleoFram.jpg",
                parcels: 1,
                opportunity: false,
                addedAt: Date.now() - 5000000
            },
            {
                id: 6,
                title: "Velas NGK Platinum",
                brand: "NGK",
                category: "Velas",
                price: 78.80,
                model: "Universal",
                image: "img/VelasNGKPlatinum.jpg",
                parcels: 3,
                opportunity: true,
                addedAt: Date.now() - 6000000
            },
            {
                id: 7,
                title: "Correia Dentada Gates",
                brand: "Gates",
                category: "Correia",
                price: 150.00,
                model: "Universal",
                image: "img/CorreiaDentadaGates.jpg",
                parcels: 4,
                opportunity: false,
                addedAt: Date.now() - 7000000
            },
            {
                id: 8,
                title: "Amortecedor Monroe",
                brand: "Monroe",
                category: "Suspensão",
                price: 350.00,
                model: "Universal",
                image: "img/AmortecedorMonroe.jpg",
                parcels: 5,
                opportunity: true, addedAt: Date.now() - 8000000
            },
            {
                id: 9,
                title: "Filtro de Combustível Fram",
                brand: "Fram",
                category: "Filtro",
                price: 60.00,
                model: "Universal",
                image: "img/FiltrodeCombustivelFram.jpg",
                parcels: 3,
                opportunity: false,
                addedAt: Date.now() - 9000000
            },
            {
                id: 10,
                title: "Pastilha de Freio Bosch - Corolla 2016",
                brand: "Bosch",
                category: "Freios",
                price: 260.00,
                model: "Corolla 2016",
                image: "img/PastilhadeFreioBosch-Corolla2016.jpg",
                parcels: 5,
                opportunity: true,
                addedAt: Date.now() - 10000000
            }
        ];
    }

    // Função para preencher os conjuntos de marcas e categorias com base nos produtos.
    function populateFilterSets() {
        brandsSet.clear(); // Limpa o conjunto de marcas.
        categoriesSet.clear(); // Limpa o conjunto de categorias.
        products.forEach(p => {
            brandsSet.add(p.brand); // Adiciona a marca ao conjunto.
            categoriesSet.add(p.category); // Adiciona a categoria ao conjunto.
        });
    }

    // Função para renderizar os checkboxes de filtro.
    function renderFilterCheckboxes() {
        const brandsArr = Array.from(brandsSet).sort(); // Converte o conjunto de marcas para um array e o ordena.
        const expanded = showMoreBrands.dataset.expanded === '1'; // Verifica se o filtro está expandido.
        const limit = expanded ? brandsArr.length : 5; // Define o limite de marcas a serem exibidas.
        brandList.innerHTML = ''; // Limpa a lista de marcas.
        // Itera sobre o array de marcas e cria um checkbox para cada uma.
        brandsArr.slice(0, limit).forEach(brand => {
            const id = `brand_${brand.replace(/\W/g, '')}`; // Cria um ID único para o checkbox.
            const label = document.createElement('label'); // Cria a tag <label>.
            label.innerHTML = `<input type="checkbox" value="${brand}" id="${id}"> ${brand}`; // Define o conteúdo do label, incluindo o checkbox.
            brandList.appendChild(label); // Adiciona o label à lista de marcas.
        });
        showMoreBrands.textContent = expanded ? 'Ver menos' : 'Ver mais'; // Atualiza o texto do botão.

        // Repete o processo para as categorias.
        const categoriesArr = Array.from(categoriesSet).sort();
        categoryList.innerHTML = '';
        categoriesArr.forEach(cat => {
            const id = `cat_${cat.replace(/\W/g, '')}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${cat}" id="${id}"> ${cat}`;
            categoryList.appendChild(label);
        });
    }

    // Função para renderizar as sugestões de busca.
    function renderSuggestions(query) {
        if (!query) { // Se a busca estiver vazia...
            suggestions.classList.add('hidden'); // Esconde a lista.
            suggestions.innerHTML = ''; // Limpa a lista.
            return;
        }
        // Filtra os produtos cujas propriedades incluem a busca.
        const matches = products.filter(p => {
            const hay = `${p.title} ${p.brand} ${p.model} ${p.category}`.toLowerCase();
            return hay.includes(query);
        }).slice(0, 6); // Limita o resultado a 6 sugestões.

        if (matches.length === 0) { // Se não houver correspondências...
            suggestions.classList.add('hidden');
            suggestions.innerHTML = '';
            return;
        }

        // Gera o HTML da lista de sugestões e o insere no elemento.
        suggestions.innerHTML = matches.map(p => `<li>${p.title}</li>`).join('');
        suggestions.classList.remove('hidden'); // Mostra a lista.
    }

    // Função principal para aplicar todos os filtros e renderizar a página.
    function applyFiltersAndRender() {
        const q = searchInput.value.trim().toLowerCase(); // Obtém o termo de busca.
        // Obtém as marcas selecionadas nos checkboxes.
        const selectedBrands = Array.from(brandList.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        // Obtém as categorias selecionadas.
        const selectedCats = Array.from(categoryList.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        // Verifica se o filtro de 'Oportunidade' está marcado.
        const onlyOpportunity = !!document.querySelector('[data-filter="opportunity"]:checked');
        // Obtém os valores de preço mínimo e máximo, com valores padrão se estiverem vazios.
        const minP = parseFloat(priceMin.value) || 0;
        const maxP = parseFloat(priceMax.value) || Infinity;

        // Filtra o array de produtos com base em todos os critérios.
        filtered = products.filter(p => {
            if (onlyOpportunity && !p.opportunity) return false;
            if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
            if (selectedCats.length && !selectedCats.includes(p.category)) return false;
            if ((p.price < minP) || (p.price > maxP)) return false;
            if (q) {
                const hay = `${p.title} ${p.brand} ${p.model} ${p.category}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        // Ordena o array filtrado com base na opção selecionada.
        const sort = sortSelect.value;
        if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'recent') filtered.sort((a, b) => b.addedAt - a.addedAt);
        else if (sort === 'relevance') filtered.sort(() => 0.5 - Math.random()); // Ordenação aleatória para 'relevância'.

        currentPage = 1; // Reseta para a primeira página após os filtros.
        renderProducts(); // Chama a função para renderizar os produtos.
    }

    // Função para renderizar os produtos na tela.
    function renderProducts() {
        productsGrid.innerHTML = ''; // Limpa a grid de produtos.
        productsCount.textContent = filtered.length; // Atualiza o contador de produtos.
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE)); // Calcula o total de páginas.
        pageInfo.textContent = `${currentPage} / ${totalPages}`; // Atualiza a informação de paginação.

        const start = (currentPage - 1) * PRODUCTS_PER_PAGE; // Calcula o índice inicial do slice.
        const slice = filtered.slice(start, start + PRODUCTS_PER_PAGE); // Pega apenas os produtos da página atual.

        const tpl = document.getElementById('productCardTpl'); // Obtém o template do card de produto.

        if (slice.length === 0) { // Se não houver produtos para exibir...
            // Exibe uma mensagem de "nenhum produto encontrado".
            productsGrid.innerHTML = `<div style="padding:20px;background:#fff;border-radius:10px;border:1px solid #eee;text-align:center;">Nenhum produto encontrado</div>`;
            return;
        }

        // Itera sobre o slice de produtos e cria um card para cada um.
        slice.forEach(p => {
            const node = tpl.content.cloneNode(true); // Clona o conteúdo do template.
            const article = node.querySelector('.product-card'); // Obtém o card clonado.
            // Popula os dados do produto no card.
            article.querySelector('img').src = p.image;
            article.querySelector('img').alt = p.title;
            article.querySelector('.product-title').textContent = p.title;
            article.querySelector('.price-value').textContent = p.price.toFixed(2).replace('.', ',');
            article.querySelector('.installments').textContent = `Em até ${p.parcels}x R$ ${(p.price / p.parcels).toFixed(2).replace('.', ',')} sem juros`;
            const buyBtn = article.querySelector('.buy-btn');
            // Adiciona um listener ao botão de compra.
            buyBtn.addEventListener('click', () => addToCart(p));
            productsGrid.appendChild(node); // Adiciona o card à grid.
        });
    }
});