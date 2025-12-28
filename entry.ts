import "core-js/stable"; // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
import "regenerator-runtime/runtime"; // https://babeljs.io/blog/2019/03/19/7.4.0
import "intersection-observer"; // https://www.npmjs.com/package/intersection-observer

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (window.globalThis === undefined) {
	// @ts-expect-error Only assigning if undefined
	window.globalThis = window;
}
