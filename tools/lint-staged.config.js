module.exports = {
  '*.{css,js,json,md,scss,ts}': ['prettier --write', 'git add'],
  '*.ts': ['tslint --fix', 'git add'],
};
