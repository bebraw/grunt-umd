'use strict';

function extend(target, source) {
    var prop;

    for(prop in source) {
        if(prop in target && typeof target[prop] === 'object') {
            extend(target[prop], source[prop]);
        }
        else {
            target[prop] = source[prop];
        }
    }

    return target;
}

function handleBackwardCompatibility(options) {
    var dependency,
        dependencyType;

    for(dependencyType in options.deps) {
        if(dependencyType === 'args' || dependencyType === 'default') {
            continue;
        }

        dependency = options.deps[dependencyType];

        if(isArray(dependency)) {
            options.deps[dependencyType] = {
                items: dependency
            };
        }
    }

    return options;
}

var path = require('path');
var util = require('util');
var isArray = util.isArray;
var handlebars = require('handlebars');

module.exports = function(grunt) {

    grunt.registerMultiTask('umd', 'Surrounds code with the universal module definition.', function() {
        var file = grunt.file;
        var options = this.data;
        var tplPath;

        try{
            verifyArguments(options);
        }
        catch (error) {
            grunt.warn(error, 3);
        }

        var isFile = file.isFile;
        var template = options.template;
        if (template) {
            if (isFile(template)) {
                tplPath = template;
            }
            else {
                tplPath = path.join(__dirname, '..', 'templates', template + '.hbs');
                if (!isFile(tplPath)) {
                    tplPath = path.join(__dirname, '..', 'templates', template);
                    if (!isFile(tplPath)) {
                        grunt.warn('Cannot find template file "' + template + '".', 3);
                    }
                }
            }
        }
        else {
            tplPath = path.join(__dirname, '..', 'templates', 'umd.hbs');
        }
        var tpl = handlebars.compile(file.read(tplPath));
        var code = file.read(options.src);

        if (options.indent) {
            code = code.split(/\r?\n/g).map(function(line) {
                return options.indent + line;
            }).join(grunt.util.linefeed);
        }

        var output = generateOutput(tpl, code, options);

        file.write(options.dest || options.src, output);
        return true;
    });
};

var generateOutput = function(template, code, options) {
    var ctx = extend({}, options);

    options = handleBackwardCompatibility(options);

    options.deps = extend(getDefaults(options) || {}, options.deps);

    var defaultIndent = options.indent || '  ',
        deps = options.deps['default'] ? options.deps['default'] || options.deps['default'].items || [] : [],
        dependency,
        dependencyType,
        indent,
        items,
        prefix,
        separator,
        suffix;

    for(dependencyType in options.deps) {
        dependency = options.deps[dependencyType];
        indent = typeof dependency.indent !== 'undefined'? dependency.indent: defaultIndent;
        items = isArray(dependency) ? dependency : dependency.items || deps;
        prefix = dependency.prefix || '';
        separator = dependency.separator || ', ';
        suffix = dependency.suffix || '';
        ctx[dependencyType + 'Dependencies'] = items.map(wrap(prefix, suffix)).join(separator + indent);
    }

    ctx.dependencies = (options.deps.args || deps).join(', ');

    ctx.code = code;
    ctx.indent = options.indent;

    return template(ctx);
};

var getDefaults = function(options) {
    var globalAlias = options.globalAlias;

    return {
        amd: {
            indent: '      ',
            items: [],
            prefix: '\"',
            separator: ',\n',
            suffix: '\"'
        },
        cjs: {
            indent: '      ',
            items: [],
            prefix: 'require(\"',
            separator: ',\n',
            suffix: '\")'
        },
        global: {
            indent: '      ',
            items: [],
            prefix: globalAlias ? globalAlias + '.' : '',
            separator: ',\n',
            suffix: ''
        }
    };
};

var verifyArguments = function(options) {
    if(!options.src) {
        throw new Error('Missing source file (src).');
    }
};

var wrap = function(pre, post) {
    pre = pre || '';
    post = post || '';

    return function(v) {
        return pre + v + post;
    };
};
