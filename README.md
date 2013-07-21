# grunt-umd

Grunt task to surround JavaScript code with the [universal module definition](https://github.com/umdjs/umd/).

## Usage

Install this grunt plugin next to your project's grunt.js gruntfile with: `npm install grunt-umd`

Add the following line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-umd');
```

Then configure the task:

```javascript
grunt.initConfig({
    umd: {
        all: {
            src: 'path/to/input.js',
            dest: 'path/to/output.js', // optional, if missing the src will be used
            objectToExport: 'library', // internal object that will be exported
            amdModuleId: 'id', // optional, if missing the AMD module will be anonymous
            globalAlias: 'alias', // changes the name of the global variable
            deps: { // optional
                'default': ['foo', 'bar'],
                amd: ['foobar', 'barbar'],
                cjs: ['foo', 'barbar'],
                global: ['foobar', 'bar']
            }
        }
    }
});
```

And finally use it:

```bash
grunt umd:all
```

## Demo

Examine `Gruntfile.js`, install dependencies (`npm install`) and execute `grunt`. You should see some `/output`.
