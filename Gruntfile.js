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
                dest: 'output/<%= pkg.name %>.nodeps.js',
                objectToExport: 'nodeps',
                globalAlias: 'nodeps'
            },
            'noglobalalias': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.noglobalalias.js',
                objectToExport: 'noglobalalias'
            },
            'noobjecttoexport': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.noobjecttoexport.js',
                globalAlias: 'noobjecttoexport'
            }
        }
    });

    grunt.registerTask('default', ['umd']);
    grunt.registerTask('nodeps', ['umd:nodeps']);
    grunt.registerTask('noglobalalias', ['umd:noglobalalias']);
    grunt.registerTask('noobjecttoexport', ['umd:noobjecttoexport']);

    grunt.loadTasks('./tasks');
};
