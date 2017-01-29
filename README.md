#PixelPusher's front-end pack

##Getting started

* Install [node.js](https://nodejs.org/).
    To check if node is installed type in command line
```bash
node -v
```
* Install Gulp globally:
```bash
npm i gulp -g
```
* Install Bower globally on your system by using the following command:
```bash
npm i bower -g
```
* Install needed packages (execute in project directory):
```bash
npm i
```
This command has 3 steps:
1. starting `npm i` command. It will install all node packages 
2. starting ` bower i ` command. It will install all bower packages
3. starting ` gulp init ` command. It will install jquery, bootstrap and some empty folders to your project.

This three steps will run automatically after ` npm i ` command.

## Task list
#### Main watchers:
- watching for css, js, images changes and starting needed task:
```bash
gulp watch
```
- watching for css, js changes and starting needed task + reloading browser window:
```bash
gulp reload
```
If you want use `gulp reload` watcher you'll need to add you projects url (or local url) in `proxy` property of `gulp reload` task:
```bash
gulp.task('reload', ['css', 'js'], () => {
    browserSync.init({
        proxy: "http://example.local"
    });
    gulp.watch(cssSrc, ['css']);
    gulp.watch(`${source.js}**`, ['js']);
    gulp.watch('markup/**/*.php').on('change', browserSync.reload);
});
```
#### Additional watchers:
- watching for css changes only and starting `gulp css` command:
```bash
gulp watch:css
```
- watching for js changes only and starting `gulp js` command:
```bash
gulp watch:js
```
- watching for images changes only and starting `gulp img:min img:sprite` commands:
```bash
gulp watch:img
```
#### Libraries tasks:
- use bootstrap (this task starts automatically after `npm i` command):
```bash
gulp use:bootstrap
```
- use jquery (this task starts automatically after `npm i` command):
```bash
gulp use:jquery
```
- use animate.css:
```bash
gulp use:animate
```
- use font-awesome:
```bash
gulp use:font-awesome
```
- use fancybox:
```bash
gulp use:fancybox
```
- use all libraries:
```bash
gulp use
```
If you use animate.css or font-awesome, you'll need to uncomment animate.min and font-awesome.min files in "imports.scss' after `gulp use` command. 
#### CSS tasks:
- main css task (used in watcher):
```bash
gulp css
```
- use this task at the projects's end. It will delete all unused styles:
```bash
gulp css:uncss
```
#### JS tasks:
- main js task (used in watcher):
```bash
gulp js
```
- adding library js files to `lib.min.js` (used in all `gulp use` tasks):
```bash
gulp js:libs
```
#### Image tasks:
- compressing images (need's payment, don't use):
```bash
gulp img:tiny
```
- compressing images (free, used in watcher):
```bash
gulp img:min
```
- make sprite with all images (used in watcher):
```bash
gulp img:sprite
```
- make sprite with all png files:
```bash
gulp img:sprite-png
```
- make sprite with all jpg files:
```bash
gulp img:sprite-jpg
```

## General principles

### Components

Component consist of:
* markup template (located in `markup/components`)
* [optional] data (located in `markup/data`)
* [optional] default parameters (located in `markup/default-parameters`)

To include component call function includeComponent(string $name, string $dataFilePath = '', array $arParams = array())

In template will be available two php variables:
* `$arParams` - composed of default parameters and parameters passed during function call
* `$arResult` - populated with data from `markup/data/{$dataFilePath}.php`

#### Default parameters

Default parameters for component could be set in two places `markup/default-parameters/.global.php`
 and `markup/default-parameters/[component's name].php`

Component's specific default parameters file is optional.
 
#### Example

`<?php includeComponent('nav/menu', 'menu/simple', ['MODIFIER' => 'green']);?>`

This call means that will be included `markup/components/nav/menu.php` file
with passed into it
* `$arParams` composed of `markup/default-parameters/.global.php`,
`markup/default-parameters/nav/menu.php` _(if exists)_ and `['MODIFIER' => 'green']` _(array passed into function call)_
* `$arResult` populated with data from `markup/data/menu/simple.php`

### Images

Images used in styles should go into `img` directory.

Images used as example content should go into `markup/sample-img` directory.

