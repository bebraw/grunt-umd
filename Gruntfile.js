module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        umd: {
            'default': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.js',
                dependencies: ['foo', 'bar'], // optional
                globalDependencies: ['foobar', 'bar'], // optional
                objectToExport: 'demo',
                globalAlias: 'demo'
            }
        }
    });

    grunt.registerTask('default', ['umd']);

    grunt.loadTasks('./tasks');
};
