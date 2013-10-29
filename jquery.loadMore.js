(function ($) {
    function accessToJson (json, accessor) {
        var properties = accessor.split(/\./g);
        var res = json;

        $.each(properties, function (index, property) {
            if (!property) {
                return;
            }
            res = res[property];
        });

        return res;
    }

    function ItemTemplate (opts) {
        this.$base = opts.$base;
        this.selectors = opts.selectors || {};
        this.copyEvents = (opts.copyEvents === false) ? false : true;
    }

    ItemTemplate.prototype.renderItem = function (item) {
        var selectors = this.selectors;
        var $el = this.$base.clone(this.copyEvents);

        $.each(selectors, function (selector, value) {
            var $field = $el.find(selector);
            var methods = (typeof value == 'string') ? {
                innerHTML: value
            } : value;

            $.each(methods, function (attr, accessor) {
                var value = (typeof accessor == 'function')
                        ? accessor(item)
                        : accessToJson(item, accessor);
                
                if (attr == 'innerHTML') {
                    $field.html(value);
                } else {
                    $field.attr(attr, value);
                }
            });
        });

        return $el.get(0);
    };

    $.fn.loadMore = function (opts) {
        // init opts
        var path = opts.path;
        var jsonAccessor = opts.jsonAccessor || '.';

        if (!path) {
            throw Error('Path to resource is not found.');
        }

        // init elements
        var $root = $(this.parent().get(0));
        var $base = $(this.get(0));

        // init template
        var itemTemplate = new ItemTemplate({
            $base: $base,
            selectors: opts.selectors,
            copyEvents: opts.copyEvents
        });

        // request
        $.getJSON(opts.path, function (res) {
            var items = accessToJson(res, jsonAccessor);
            $.each(items, function (index, item) {
                $root.append(itemTemplate.renderItem(item));
            });
        });
    };
})(jQuery);










