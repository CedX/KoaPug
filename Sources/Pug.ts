import type {Context, default as Koa} from "koa";
import {extname, isAbsolute, join} from "node:path";
import type {LaunchOptions} from "playwright-core";
import Pug from "pug";
import {htmlToPdf, type PdfOptions} from "./Playwright.js";

/**
 * Attaches a view renderer to the context of the specified application.
 * @param application The application instance.
 * @param rendererOptions The renderer options.
 * @returns The newly created view renderer.
 */
export function pug(application: Koa, rendererOptions: RendererOptions = {}): typeof Pug {
	const renderer = Pug;

	/**
	 * Resolves the path of the specified view.
	 * @param view The view name.
	 * @returns The path corresponding to the specified view.
	 */
	function resolvePath(view: string): string {
		if (!extname(view)) view += ".pug";
		return isAbsolute(view) || !rendererOptions.basedir ? view : join(rendererOptions.basedir, view);
	}

	/**
	 * Renders the specified view.
	 * @param view The view name.
	 * @param locals The data that should be made available in the view.
	 * @param renderingOptions The rendering options.
	 * @returns The rendering result.
	 */
	function render(this: Context, view: string, locals: object = {}, renderingOptions: RenderingOptions = {}): Promise<string> {
		const data = {...rendererOptions, ...this.state, ...locals};
		const html = renderer.renderFile(resolvePath(view), data);

		if (renderingOptions.writeResponse ?? true) {
			this.body = html;
			this.type = "html";
		}

		return Promise.resolve(html);
	}

	/**
	 * Renders the specified view as a PDF document.
	 * @param view The view name.
	 * @param locals The data that should be made available in the view.
	 * @param renderingOptions The rendering options.
	 * @returns The rendering result.
	 */
	async function renderPdf(this: Context, view: string, locals: object = {}, renderingOptions: PdfOptions & RenderingOptions = {}): Promise<Buffer> {
		const data = {...rendererOptions, ...this.state, ...locals};
		const html = renderer.renderFile(resolvePath(view), data);

		const pdf = await htmlToPdf(html, {browser: rendererOptions.browser, pdf: renderingOptions});
		if (renderingOptions.writeResponse ?? true) {
			this.body = pdf;
			this.type = "pdf";
		}

		return pdf;
	}

	// Attach the rendering functions to the application context.
	Object.defineProperties(application.context, {
		render: {value: render},
		renderPdf: {value: renderPdf}
	});

	return renderer;
}

/**
 * Defines the renderer options.
 */
export type RendererOptions = Pug.Options & Partial<{

	/**
	 * The launch options for the browser used to render PDF documents.
	 */
	browser: LaunchOptions;
}>;

/**
 * Defines the rendering options.
 */
export type RenderingOptions = Partial<{

	/**
	 * Value indicating whether to write the rendering result to the response.
	 */
	writeResponse: boolean;
}>;
