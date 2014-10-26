'use strict';

// TODO: extract this into its own npm module.

var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    fs = require('fs'),
    handlebars = require('handlebars'),
    isArray = require('util').isArray,
    path = require('path');

var UMD = function UMD(code, options) {
    EventEmitter.call(this);
    this.code = code;
    this.options = options || {};

    this.template = this.loadTemplate(options.template);
};

inherits(UMD, EventEmitter);

UMD.prototype._getDependencyDefaults = function _getDependencyDefaults() {
    var globalAlias = this.options.globalAlias;

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

UMD.prototype.loadTemplate = function loadTemplate(filepath) {
    var tplPath,
        exists = fs.existsSync;

    if (filepath) {
        if (exists(filepath)) {
            tplPath = filepath;
        } else {
            tplPath = path.join(__dirname, 'templates', filepath + '.hbs');
            if (!exists(tplPath)) {
                tplPath = path.join(__dirname, 'templates', filepath);
                if (!exists(tplPath)) {
                    this.emit('error', 'Cannot find template file "' + filepath + '".');
                    return;
                }
            }
        }
    } else {
        tplPath = path.join(__dirname, 'templates', 'umd.hbs');
    }

    try {
        return handlebars.compile(fs.readFileSync(tplPath, 'utf-8'));
    } catch (e) {
        this.emit('error', e.message);
    }
};

UMD.prototype.generate = function generate() {
    var options = this.options,
        indent = this.options.indent,
        code = this.code,
        extend = UMD.extend,
        ctx = extend({}, options);

    if (indent) {
        code = code.split(/\r?\n/g).map(function (line) {
            if (!line.trim()) {
                return '';
            }
            return indent + line;
        }).join(process.platform === 'win32' ? '\r\n' : '\n');
    }

    var depsOptions = extend(this._getDependencyDefaults(options) || {}, options.deps);

    var defaultIndent = indent || '  ',
        defaultDeps = depsOptions['default'],
        deps = defaultDeps ? defaultDeps || defaultDeps.items || [] : [],
        dependency,
        dependencyType,
        dependencyIndent,
        items,
        prefix,
        separator,
        suffix;

    for (dependencyType in depsOptions) {
        dependency = depsOptions[dependencyType];
        dependencyIndent = typeof dependency.indent !== 'undefined' ? dependency.indent :
            defaultIndent;
        items = isArray(dependency) ? dependency : dependency.items || deps;
        prefix = dependency.prefix || '';
        separator = dependency.separator || ', ';
        suffix = dependency.suffix || '';
        ctx[dependencyType + 'Dependencies'] = items.map(UMD.wrap(prefix, suffix)).join(separator +
            dependencyIndent);
    }

    ctx.dependencies = (depsOptions.args || deps).join(', ');

    ctx.code = code;
    ctx.indent = options.indent;

    return this.template(ctx);
};

UMD.wrap = function wrap(pre, post) {
    pre = pre || '';
    post = post || '';

    return function (v) {
        return pre + v + post;
    };
};

UMD.extend = function extend(target, source) {
    var prop;

    for (prop in source) {
        if (prop in target && typeof target[prop] === 'object') {
            extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }

    return target;
};

module.exports = UMD;
