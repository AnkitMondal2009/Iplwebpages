(function(a) {
    a.fn.ddTableFilter = function(b) {
        b = a.extend(true, a.fn.ddTableFilter.defaultOptions, b);
        return this.each(function() {
            if (a(this).hasClass("ddtf-processed")) {
                e(this);
                return
            }
            var d = a(this);
            var f = new Date();
            a("th:visible", d).each(function(j) {
                if (a(this).hasClass("skip-filter")) {
                    return
                }
                var g = a('<select class="form-control">');
                var h = [];
                var k = [];
                g.append('<option value="--all--">' + a(this).text() + "</option>");
                var i = a("tr:not(.skip-filter) td:nth-child(" + (j + 1) + ")", d).each(function() {
                    var m = b.valueCallback.apply(this);
                    if (m.length == 0) {
                        m = "--empty--"
                    }
                    a(this).attr("ddtf-value", m);
                    if (a.inArray(m, h) === -1) {
                        var l = b.textCallback.apply(this);
                        if (l.length == 0) {
                            l = b.emptyText
                        }
                        h.push(m);
                        k.push({
                            val: m,
                            text: l
                        })
                    }
                });
                if (k.length < b.minOptions) {
                    return
                }
                if (b.sortOpt) {
                    k.sort(b.sortOptCallback)
                }
                a.each(k, function() {
                    a(g).append('<option value="' + this.val + '">' + this.text + "</option>")
                });
                a(this).wrapInner('<div style="display:none">');
                a(this).append(g);
                g.bind("change", {
                    column: i
                }, function(l) {
                    var n = new Date();
                    var m = a(this).val();
                    l.data.column.each(function() {
                        if (a(this).attr("ddtf-value") === m || m == "--all--") {
                            a(this).removeClass("ddtf-filtered")
                        } else {
                            a(this).addClass("ddtf-filtered")
                        }
                    });
                    var o = new Date();
                    if (b.debug) {
                        console.log("Search: " + (o.getTime() - n.getTime()) + "ms")
                    }
                    e(d)
                });
                d.addClass("ddtf-processed");
                if (a.isFunction(b.afterBuild)) {
                    b.afterBuild.apply(d)
                }
            });

            function e(h) {
                var i = new Date();
                a("tr", h).each(function() {
                    var j = a(this);
                    if (a("td.ddtf-filtered", j).length > 0) {
                        b.transition.hide.apply(j, b.transition.options)
                    } else {
                        b.transition.show.apply(j, b.transition.options)
                    }
                });
                if (a.isFunction(b.afterFilter)) {
                    b.afterFilter.apply(h)
                }
                if (b.debug) {
                    var g = new Date();
                    console.log("Refresh: " + (g.getTime() - i.getTime()) + "ms")
                }
            }
            if (b.debug) {
                var c = new Date();
                console.log("Build: " + (c.getTime() - f.getTime()) + "ms")
            }
        })
    };
    a.fn.ddTableFilter.defaultOptions = {
        valueCallback: function() {
            return encodeURIComponent(a.trim(a(this).text()))
        },
        textCallback: function() {
            return a.trim(a(this).text())
        },
        sortOptCallback: function(d, c) {
            return d.text.toLowerCase() > c.text.toLowerCase()
        },
        afterFilter: null,
        afterBuild: null,
        transition: {
            hide: a.fn.hide,
            show: a.fn.show,
            options: []
        },
        emptyText: "--Empty--",
        sortOpt: true,
        debug: false,
        minOptions: 2
    }
})(jQuery);