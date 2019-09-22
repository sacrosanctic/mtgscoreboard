module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/mtgscoreboard/'
    : '/',
  runtimeCompiler: true,
}