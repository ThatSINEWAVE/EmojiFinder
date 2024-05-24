document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'https://emojihub.yurace.pro/api';

    const mainMenu = document.getElementById('main-menu');
    const emojiDisplay = document.getElementById('emoji-display');
    const emojiContent = document.getElementById('emoji-content');
    const categoriesMenu = document.getElementById('categories');
    const categoryGrid = document.querySelector('.category-grid');
    const emojiList = document.getElementById('emoji-list');
    const groupButtons = document.getElementById('group-buttons');
    const emojiGrid = document.querySelector('.emoji-grid');

    const randomEmojiButton = document.getElementById('random-emoji');
    const exploreCategoriesButton = document.getElementById('explore-categories');
    const getAnotherOneButton = document.getElementById('get-another-one');
    const goBackButton = document.getElementById('go-back');
    const backToMainButton = document.getElementById('back-to-main');
    const backToCategoriesButton = document.getElementById('back-to-categories');

    const categoryEndpoints = [
        { name: 'Smileys & People', endpoint: '/all/category/smileys-and-people', groups: ['body', 'cat-face', 'clothing', 'creature-face', 'emotion', 'face-negative', 'face-neutral', 'face-positive', 'face-role', 'face-sick', 'family', 'monkey-face', 'person', 'person-activity', 'person-gesture', 'person-role', 'skin-tone'] },
        { name: 'Animals & Nature', endpoint: '/all/category/animals-and-nature', groups: ['animal-amphibian', 'animal-bird', 'animal-bug', 'animal-mammal', 'animal-marine', 'animal-reptile', 'plant-flower', 'plant-other'] },
        { name: 'Food & Drink', endpoint: '/all/category/food-and-drink', groups: ['dishware', 'drink', 'food-asian', 'food-fruit', 'food-prepared', 'food-sweet', 'food-vegetable'] },
        { name: 'Travel & Places', endpoint: '/all/category/travel-and-places', groups: [] },
        { name: 'Activities', endpoint: '/all/category/activities', groups: [] },
        { name: 'Objects', endpoint: '/all/category/objects', groups: [] },
        { name: 'Symbols', endpoint: '/all/category/symbols', groups: [] },
        { name: 'Flags', endpoint: '/all/category/flags', groups: [] }
    ];

    function displayEmoji(emoji) {
        emojiContent.innerHTML = `${emoji.htmlCode[0]}`;
        const details = document.createElement('div');
        details.innerHTML = `
            <p>Name: ${emoji.name}</p>
            <p>Category: ${emoji.category}</p>
            <p>Group: ${emoji.group}</p>
        `;
        emojiContent.appendChild(details);
    }

    function fetchRandomEmoji() {
        fetch(`${apiBaseUrl}/random`)
            .then(response => response.json())
            .then(data => {
                displayEmoji(data);
                emojiDisplay.classList.remove('hidden');
                mainMenu.classList.add('hidden');
            });
    }

    function loadCategories() {
        categoryGrid.innerHTML = '';
        categoryEndpoints.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.onclick = () => fetchCategoryEmojis(category);
            categoryGrid.appendChild(button);
        });
        categoriesMenu.classList.remove('hidden');
        mainMenu.classList.add('hidden');
    }

    function fetchCategoryEmojis(category) {
        fetch(`${apiBaseUrl}${category.endpoint}`)
            .then(response => response.json())
            .then(data => {
                displayGroupButtons(category.groups);
                displayEmojis(data);
                emojiList.classList.remove('hidden');
                categoriesMenu.classList.add('hidden');
            });
    }

    function displayGroupButtons(groups) {
        groupButtons.innerHTML = '';
        if (groups.length === 0) {
            groupButtons.classList.add('hidden');
        } else {
            groupButtons.classList.remove('hidden');
            groups.forEach(group => {
                const button = document.createElement('button');
                button.textContent = group;
                button.onclick = () => fetchGroupEmojis(group);
                groupButtons.appendChild(button);
            });
        }
    }

    function fetchGroupEmojis(group) {
        fetch(`${apiBaseUrl}/all/group/${group}`)
            .then(response => response.json())
            .then(data => {
                displayEmojis(data);
            });
    }

    function displayEmojis(emojis) {
        emojiGrid.innerHTML = '';
        emojis.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.innerHTML = emoji.htmlCode[0];
            emojiButton.onclick = () => displayEmoji(emoji);
            emojiGrid.appendChild(emojiButton);
        });
    }

    randomEmojiButton.onclick = fetchRandomEmoji;
    exploreCategoriesButton.onclick = loadCategories;
    getAnotherOneButton.onclick = fetchRandomEmoji;
    goBackButton.onclick = () => {
        emojiDisplay.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    };
    backToMainButton.onclick = () => {
        categoriesMenu.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    };
    backToCategoriesButton.onclick = () => {
        emojiList.classList.add('hidden');
        categoriesMenu.classList.remove('hidden');
    };

    emojiContent.onclick = () => {
        const range = document.createRange();
        range.selectNode(emojiContent);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        emojiContent.innerHTML = '&#10004;';
        setTimeout(() => {
            fetch(`${apiBaseUrl}/random`)
                .then(response => response.json())
                .then(data => displayEmoji(data));
        }, 1000);
    };
});
