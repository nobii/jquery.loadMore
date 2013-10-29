(function ($) {
    var accessToJson = function (json, accessor) {
        var properties = accessor.split(/\./g);
        var res = json;

        $.each(properties, function (index, property) {
            if (!property) {
                return;
            }
            res = res[property];
        });

        return res;
    };


    $.fn.loadMore = function (opts) {
        // init opts
        var path = opts.path;
        var jsonAccessor = opts.jsonAccessor || '.';
        var copyEvents = (opts.copyEvents === false) ? false : true;
        var selectors = opts.selectors || {};

        if (!path) {
            throw Error('Path to resource is not found.');
        }

        // init elements
        var $el = this;
        var $root = $($el.parent().get(0));
        var $template = $($el.get(0));

        // request
        $.getJSON(opts.path, function (res) {
            var items = accessToJson(res, jsonAccessor);

            $.each(items, function (index, item) {
                var $el = $template.clone(copyEvents);

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

                $root.append($el);
            });
        });
    };
})(jQuery);










