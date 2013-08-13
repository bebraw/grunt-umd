var path = require('path');
var extend = require('util')._extend;

var handlebars = require('handlebars');


module.exports = function(grunt) {

    grunt.registerMultiTask('umd', 'Surrounds code with the universal module definition.', function() {
        try{
            verifyArguments(this.data);
        }
        catch (error) {
            grunt.warn(error, 3);
        }

        var tplPath = path.join(__dirname, '..', 'templates', 'umd.hbs');
        var tpl = handlebars.compile(grunt.file.read(tplPath));
        var code = grunt.file.read(this.data.src);
        var output = generateOutput(tpl, code, this.data);

        grunt.file.write(this.data.dest || this.data.src, output);
        return true;
    });

};

var verifyArguments = function(options) {
    if (!options.src) {
        throw new Error("Missing source file (src).");
    }

    if (!options.objectToExport) {
        throw new Error("Missing name of object to export (objectToExport).");
    }

    if (!options.globalAlias) {
        throw new Error('Missing name of global alias (globalAlias)');
    }
};

var generateOutput = function(template, code, options) {
    var ctx = extend({}, options);

    options.deps = options.deps || {};

    var deps = options.deps['default'] || [];
    var amdDeps = options.deps.amd || deps;
    var cjsDeps = options.deps.cjs || deps;
    var globalDeps = options.deps.global || deps;

    ctx.dependencies = deps.join(', ');
    ctx.amdDependencies = amdDeps.map(wrap("'", "'")).join(', ');
    ctx.cjsDependencies = cjsDeps.map(wrap("require('", "')")).join(', ');
    ctx.globalDependencies = globalDeps.map(wrap('root.')).join(', ');
    ctx.code = code;

    return template(ctx);
};

var wrap = function(pre, post) {
    pre = pre || '';
    post = post || '';

    return function(v) {
        return pre + v + post;
    };
};
