# Pug for Koa
A [Koa](https://koajs.com) view renderer based on the [Pug](https://pugjs.org) template engine.
	
## Quick start
Install the latest version of **Pug for Koa** with [npm](https://www.npmjs.com) package manager:

```shell
npm install @cedx/koa-pug
```

For detailed instructions, see the [installation guide](Installation.md).

## Usage
This library provides a `pug()` function that you simply invoke by passing the instance
of your Koa application as an argument.

```js
import {pug} from "@cedx/koa-pug";
import Koa from "koa";

// Initialize the application.
const app = new Koa;
pug(app);
```

This function will add two new methods `render()` and `renderPdf()` to the request context,
that you can use to render [Pug](https://pugjs.org) view templates.

```js
// Render the "view.pug" template.
app.use(ctx => ctx.render("view"));
```

For more information, visit the pages dedicated to each of them:

- [The `ctx.render()` method.](RenderHtml.md)
- [The `ctx.renderPdf()` method.](RenderPdf.md)

### Options
The `pug()` function accepts an option object as a second argument.
These options are directly passed to the [Pug](https://pugjs.org) methods.

The most important one is the `basedir` option that let you specify the path of the directory containing your view templates.

```js
import {pug} from "@cedx/koa-pug";
import {join} from "node:path";

// Initialize the template engine.
const directory = join(import.meta.dirname, "path/to/view/folder");
pug(app, {basedir: directory});
```

Please refer to the [Pug documentation](https://pugjs.org) for details
of [all configuration options](https://pugjs.org/api/reference.html).
