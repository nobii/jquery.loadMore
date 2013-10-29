(function () {
    function init () {
        $('#list-article .block-article').loadMore({
            path: '/example/api/articles.json',
            jsonAccessor: '.result',
            selectors: {
                '.block-article-title': '.title',
                '.txt-article-date': '.date',
                '.txt-article-category': {
                    class: function (item) {
                        return [
                            'txt-article-category',
                            'category-' + item.category
                        ].join(' ');
                    },
                    innerHTML: '.categoryLabel'
                }
            }
        });
    }

    $(init);
})();
