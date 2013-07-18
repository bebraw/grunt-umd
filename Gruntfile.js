module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        umd: {
            'default': {
                src: 'demo/<%= pkg.name %>.js',
                dest: 'output/<%= pkg.name %>.js',
                objectToExport: 'demo'
            }
        }
    });

    grunt.registerTask('refresh', ['umd']);
    grunt.registerTask('default', ['refresh']);

    grunt.loadTasks('./tasks');
};
