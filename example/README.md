loadMore
======

Load data and render elements.

## install

### from bower
```
bower install loadMore
```

### from github
```
git clone git://github.com/fnobi/jquery.loadmore.git
```

## usage
```
(function () {
    function init () {
        $('#list-article .block-article').loadMore({
            path: '/example/api/articles.json',
            jsonAccessor: '.result',
            selectors: {
                '.block-article-title': 'title',
                '.block-article-meta': 'date'
            }
        });
    }

    $(init);
})();

```
