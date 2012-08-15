module.exports = function(grunt) {

    grunt.registerMultiTask('umd', 'Surrounds code with the universal module definition.', function() {
        try{
            verifyArguments(this.data);
        }
        catch (error) {
            grunt.warn(error, 3);
        }

        var code = grunt.file.read(this.data.src);
        var output = generateOutput(code, this.data);

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
};

var generateOutput = function(code, options) {
    var output = umdString + '';
    output = output.replace('__amdModuleId, ', options.amdModuleId ? "'" + options.amdModuleId + "', " : '');
    output = output.replace('__globalAlias', options.globalAlias || options.objectToExport);
    output = output.replace('__objectToExport', options.objectToExport);
    output = output.replace('__code', code);
    return output;
};

var umdFunction = function () {

    (function (root, factory) {

        if (typeof exports === 'object') {
            module.exports = factory();
        }
        else if (typeof define === 'function' && define.amd) {
            define(__amdModuleId, factory);
        }
        else {
            root.__globalAlias = factory();
        }

    }(this, function () {

        __code
        return __objectToExport;

    }));

};

var umdString = umdFunction.toString()
    .replace(/^function\s*\(.*\)\s*\{\s*/, '')
    .replace(/\s*\}\s*$/, '');