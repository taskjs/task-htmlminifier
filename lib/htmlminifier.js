var Execution = require('execution');
var Record = require('record');

module.exports = Execution.extend({
    // The type of option could be HTML5 input types: file, directory, number, range, select,
    // url, email, tel, color, date, time, month, time, week, datetime(datetime-local),
    // string(text), boolean(checkbox), array, regexp, function and object.
    options: {
        removeComments: {
            label: 'Strip comments',
            placeholder: 'Conditional comments are left intact, but their inner (insignificant) whitespace is removed',
            default: false,
            type: 'boolean'
        },
        removeCommentsFromCDATA: {
            label: 'Strip comments from CDATA',
            placeholder: 'Strip comments from scripts and styles',
            default: false,
            type: 'boolean'
        },
        removeCDATASectionsFromCDATA: {
            label: 'Strip CDATA sections from CDATA',
            placeholder: 'Remove CDATA sections from script and style elements',
            default: false,
            type: 'boolean'
        },
        collapseWhitespace: {
            label: 'Collapse whitespace',
            placeholder: 'Collapse white space that contributes to text nodes in a document tree',
            default: false,
            type: 'boolean'
        },
        conservativeCollapse: {
            label: 'Conservative collapse',
            placeholder: 'Always collapse to 1 space (never remove it entirely)',
            default: false,
            type: 'boolean'
        },
        removeAttributeQuotes: {
            label: 'Remove attribute quotes',
            placeholder: 'Remove quotes around attributes when possible. e.g. <p class="foo"> → <p class=foo>',
            default: false,
            type: 'boolean'
        },
        removeOptionalTags: {
            label: 'Remove optional tags',
            placeholder: 'Remove optional tags. Currently, only: </html>, </head>, </body>, </option> </thead>, </tbody>, </tfoot>, and </tr>',
            default: false,
            type: 'boolean'
        },
        collapseBooleanAttributes: {
            label: 'Collapse boolean attributes',
            placeholder: 'e.g. <... disabled="disabled"> → <... disabled>',
            default: false,
            type: 'boolean'
        },
        removeRedundantAttributes: {
            label: 'Remove redundant attributes',
            placeholder: 'Remove attributes when value matches default',
            default: false,
            type: 'boolean'
        },
        useShortDoctype: {
            label: 'Use HTML5 doctype',
            placeholder: 'Replaces the doctype with the short (HTML5) doctype',
            default: false,
            type: 'boolean'
        },
        removeEmptyAttributes: {
            label: 'Remove empty attributes',
            placeholder: 'Valid attributes are: class, id, style, title, lang, dir, event attributes',
            default: false,
            type: 'boolean'
        },
        removeEmptyElements: {
            label: 'Remove empty elements',
            placeholder: 'Remove all elements with empty contents except <textarea>',
            default: false,
            type: 'boolean'
        },
        lint: {
            label: 'Linting',
            placeholder: 'Toggle linting',
            default: false,
            type: 'boolean'
        },
        keepClosingSlash: {
            label: 'Keep trailing slash',
            placeholder: 'Keep the trailing slash on singleton elements',
            default: false,
            type: 'boolean'
        },
        caseSensitive: {
            label: 'Case sensitive',
            placeholder: 'Treat attributes in case sensitive manner (useful for SVG; e.g. viewBox)',
            default: false,
            type: 'boolean'
        },
        minifyJS: {
            label: 'Minify Javascript',
            placeholder: 'Minify Javascript in script elements and on* attributes',
            default: false,
            type: 'boolean'
        },
        minifyCSS: {
            label: 'Minify CSS',
            placeholder: 'Minify CSS in style elements and style attributes ',
            default: false,
            type: 'boolean'
        },
        ignoreCustomComments: {
            label: 'Ignore certain comments',
            placeholder: 'Array of regex\'es that allow to ignore certain comments, when matched',
            default: [],
            type: 'array'
        },
        processScripts: {
            label: 'Script elements to process',
            placeholder: 'e.g. "text/ng-template", "text/x-handlebars-template"',
            default: [],
            type: 'array'
        }
    },
    run: function (inputs, options, logger, settings) {
        return this._run(inputs, options, logger, settings);
    },
    execute: function (resolve, reject) {
        var options = this.options;
        var inputs = this.inputs;
        var logger = this.logger;

        var htmlMinifier = require('html-minifier');

        var records = inputs.map(function(input){

            var contents = input.contents.toString();
            // xml header declaration like <?xml version="1.0" encoding="UTF-8"?>
            // strip it temporary, because htmlMinifier can not proecss it
            var xmlHeader ='';
            contents = contents.replace(/\s*<\?xml.*?>/, function(xml){
                xmlHeader = xml;
                return '';
            });

            var minimized = htmlMinifier.minify(contents, options);

            // if there is a xml header, put it on the top of html again
            minimized = xmlHeader + minimized;

            // safe removing whitespace and line endings using regexp
            minimized = minimized.replace(/>\s+</g,"> <");

            var record = new Record({
                path: input.path,
                contents: minimized
            });

            record.origin = input.contents;

            return record;

        });

        resolve(records);
    }
})
