module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        umd: {
            'default': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.js',
                deps: { // optional
                    'default': ['foo', 'bar'],
                    global: ['foobar', 'bar'] // custom override
                },
                objectToExport: 'demo',
                globalAlias: 'demo'
            },
            'nodeps': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.js',
                objectToExport: 'nodeps',
                globalAlias: 'nodeps'
            }
        }
    });

    grunt.registerTask('default', ['umd']);
    grunt.registerTask('nodeps', ['umd:nodeps']);

    grunt.loadTasks('./tasks');
};
