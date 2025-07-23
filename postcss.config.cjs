// postcss.config.cjs へリネームしてください（ViteのESM対応のため）
module.exports = {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
};
