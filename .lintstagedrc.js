// .lintstagedrc.js
module.exports = {
    'pages/*.{js,jsx,ts,tsx}': [
      (filenames) =>
        `next lint --fix --file ${filenames
          .map((file) => file.split(process.cwd())[1])}`,
      'prettier --write',
    ],
  }
