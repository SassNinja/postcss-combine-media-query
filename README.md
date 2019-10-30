# postcss-combine-media-query

[![Build Status](https://travis-ci.com/SassNinja/postcss-combine-media-query.svg?branch=master)](https://travis-ci.com/SassNinja/postcss-combine-media-query)

If you are used to write the media queries of your components within those components (what you should do instead of maintaining a large global media query file) you might end up with CSS that contains the same media query rule multiple times.

```css
.foo { color: red; }
@media (min-width: 1024px) {
    .foo { color: green; }
}
.bar { font-size: 1rem; }
@media (min-width: 1024px) {
    .bar { font-size: 2rem; }
}
```

While this is totally fine in development (and supports a modular structure in particular when using [Sass](https://sass-lang.com/)) it's not that good for production where you wanna keep your CSS as small as possible.

That's the use case this plugin is built for!
It looks for equal media query rules and appends them combined.

```css
.foo { color: red; }
.bar { font-size: 1rem; }
@media (min-width: 1024px) {
    .foo { color: green; }
    .bar { font-size: 2rem; }
}
```

## Installation

- npm
```bash
npm install postcss-combine-media-query --save-dev
```

- yarn
```bash
yarn add postcss-combine-media-query --dev
```

## Usage

Simply add the plugin to your PostCSS config.
That's all – easy as pie :wink: (there are no options)

If you're not familiar with using PostCSS you should read the official [PostCSS documentation](https://github.com/postcss/postcss#usage) first.

## Side Effects

Since this plugin moves all media queries to end of the file it may introduce bugs if your CSS is not well structured. So keep that in mind!

Let's say you've got the following code which results in `.foo` being yellow on desktop.

```css
.foo { color: red; }
@media (min-width: 1024px) {
    .foo { color: green; }
}
.foo { color: yellow; }
```

Once you use this plugin it will change into `green` because the media query has been moved.

```css
.foo { color: red; }
.foo { color: yellow; }
@media (min-width: 1024px) {
    .foo { color: green; }
}
```

Therefore it's recommended to use this plugin in development as well to detect such side effects sooner.

## Credits

If this plugin is helpful to you it'll be great when you give me a star on github and share it. Keeps me motivated to continue the development.
