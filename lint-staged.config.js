export default {
  'packages/client/**/*.{ts,tsx}': (files) => {
    // Convert absolute paths to paths relative to the client package
    const relativePaths = files.map((f) =>
      f.replace(/^.*\/packages\/client\//, './')
    );
    return `cd packages/client && eslint --fix ${relativePaths.join(' ')}`;
  },
  'packages/**/*.ts': 'prettier --write',
  '*.{json,md,yaml,yml}': 'prettier --write',
};
