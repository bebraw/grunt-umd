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
            template: 'path/to/template.hbs', // optional; a template from templates subdir can be specified by name (e.g. 'umd');
                // if missing the templates/umd.hbs file will be used
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

## Templates

The following predefined templates are available:

* `umd` - the default template; the template is based on [umd/returnExports.js](https://github.com/umdjs/umd/blob/master/returnExports.js)
* `unit` - the template that can be helpful to wrap standalone CommonJS/Node modules; it is slightly modified version of `umd` template

The template that should be applied can be specified by `template` option (e.g. `'umd'` or `'unit'`).
You can create and use your own template (see predefined templates for examples). 
The path to the template file should be set relative to Gruntfile.

## Demo

Examine `Gruntfile.js`, install dependencies (`npm install`) and execute `grunt`. You should see some `/output`.
