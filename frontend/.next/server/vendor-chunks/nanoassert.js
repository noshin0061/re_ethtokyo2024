/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nanoassert";
exports.ids = ["vendor-chunks/nanoassert"];
exports.modules = {

/***/ "(rsc)/../backend/node_modules/nanoassert/index.js":
/*!***************************************************!*\
  !*** ../backend/node_modules/nanoassert/index.js ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = assert\n\nclass AssertionError extends Error {}\nAssertionError.prototype.name = 'AssertionError'\n\n/**\n * Minimal assert function\n * @param  {any} t Value to check if falsy\n * @param  {string=} m Optional assertion error message\n * @throws {AssertionError}\n */\nfunction assert (t, m) {\n  if (!t) {\n    var err = new AssertionError(m)\n    if (Error.captureStackTrace) Error.captureStackTrace(err, assert)\n    throw err\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vYmFja2VuZC9ub2RlX21vZHVsZXMvbmFub2Fzc2VydC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxTQUFTO0FBQ3JCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi4vYmFja2VuZC9ub2RlX21vZHVsZXMvbmFub2Fzc2VydC9pbmRleC5qcz9lODk5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0XG5cbmNsYXNzIEFzc2VydGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige31cbkFzc2VydGlvbkVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJ1xuXG4vKipcbiAqIE1pbmltYWwgYXNzZXJ0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gIHthbnl9IHQgVmFsdWUgdG8gY2hlY2sgaWYgZmFsc3lcbiAqIEBwYXJhbSAge3N0cmluZz19IG0gT3B0aW9uYWwgYXNzZXJ0aW9uIGVycm9yIG1lc3NhZ2VcbiAqIEB0aHJvd3Mge0Fzc2VydGlvbkVycm9yfVxuICovXG5mdW5jdGlvbiBhc3NlcnQgKHQsIG0pIHtcbiAgaWYgKCF0KSB7XG4gICAgdmFyIGVyciA9IG5ldyBBc3NlcnRpb25FcnJvcihtKVxuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoZXJyLCBhc3NlcnQpXG4gICAgdGhyb3cgZXJyXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../backend/node_modules/nanoassert/index.js\n");

/***/ })

};
;