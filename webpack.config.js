const path = require('path');
module.exports = {
    entry: './src/index.tsx',
    mode: "production",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'audio-player-react',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: ["ts-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    externals: {
        react: "react"
    },
    resolve: {
        extensions: [".tsx", ".ts"]
    }
}