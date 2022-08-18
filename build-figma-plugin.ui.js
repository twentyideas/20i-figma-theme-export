/* eslint-disable @typescript-eslint/no-unsafe-return */
module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    define: {
      global: "window",
    },
  }
}
