"use strict";

var typpy = require("typpy"),
    iterateObj = require("iterate-object"),
    Err = require("err"),
    objDef = require("obj-def"),
    emptyObj = require("is-empty-obj"),
    cheerio = require("cheerio");

module.exports = function ($, opts) {

    if (typeof $ === "string") {
        $ = cheerio.load($);
    }

    // Normalizes the option
    var normalizeOpt = function normalizeOpt(v) {
        if (typpy(v, String)) {
            v = { selector: v };
        }
        objDef(v, "data", {});
        objDef(v, "how", "text", true);
        if (v.attr) {
            v.how = function ($elm) {
                return $elm.attr(v.attr);
            };
        }
        objDef(v, "trimValue", true);
        objDef(v, "closest", "");
        return v;
    };

    // Recursively handles the data
    var handleDataObj = function handleDataObj(data, $context) {
        var pageData = {};
        iterateObj(data, function (cOpt, optName) {

            cOpt = normalizeOpt(cOpt);
            cOpt.name = optName;

            var $cContext = $context === $ ? undefined : $context;
            if (!$cContext && !cOpt.selector && !cOpt.listItem) {
                throw new Err("There is no element selected for the '<option.name>' field. Please provide a selector, list item or use nested object structure.", {
                    option: cOpt,
                    code: "NO_ELEMENT_SELECTED"
                });
            }

            var $elm = cOpt.selector ? $(cOpt.selector, $cContext) : $cContext;

            // Handle lists
            if (cOpt.listItem) {
                var docs = pageData[cOpt.name] = [],
                    $items = $(cOpt.listItem, $cContext),
                    isEmpty = emptyObj(cOpt.data);

                if (isEmpty) {
                    cOpt.data.___raw = {};
                }

                for (var i = 0; i < $items.length; ++i) {
                    var cDoc = handleDataObj(cOpt.data, $items.eq(i));
                    var convert = cOpt.convert || function (x) {
                        return x;
                    };
                    docs.push(convert(cDoc.___raw || cDoc));
                }
            } else {

                if (typpy(cOpt.eq, Number)) {
                    $elm = $elm.eq(cOpt.eq);
                }

                if (typpy(cOpt.texteq, Number)) {
                    var children = $elm.contents(),
                        textCounter = 0,
                        found = false;

                    for (var _i = 0, child; child = children[_i]; _i++) {
                        if (child.type === "text") {
                            if (textCounter == cOpt.texteq) {
                                $elm = child;
                                found = true;
                                break;
                            }
                            textCounter++;
                        }
                    }

                    if (!found) {
                        $elm = cheerio.load("");
                    }

                    cOpt.how = function (elm) {
                        return elm.data;
                    };
                }

                // Handle closest
                if (cOpt.closest) {
                    $elm = $elm.closest(cOpt.closest);
                }

                if (!emptyObj(cOpt.data)) {
                    pageData[cOpt.name] = handleDataObj(cOpt.data, $elm);
                    return pageData;
                }

                var value = typpy(cOpt.how, Function) ? cOpt.how($elm) : $elm[cOpt.how]();
                value = value === undefined ? "" : value;
                if (cOpt.trimValue && typpy(value, String)) {
                    value = value.trim();
                }

                if (cOpt.convert) {
                    value = cOpt.convert(value, $elm);
                }

                pageData[cOpt.name] = value;
            }
        });
        return pageData;
    };

    return handleDataObj(opts);
};