// `actions/github-script@v6` doesn't support npm in this file
// `github-actions` supports only Node 16 so far
// @see https://docs.github.com/zh/actions/creating-actions/metadata-syntax-for-github-actions#runs

import path from "node:path";
import fs from "node:fs";

const getMatrix = async (githubWorkspace) => {
  const root = path.resolve(githubWorkspace);
  const matrix1 = await fs.promises.readdir(root, {
    withFileTypes: true,
    recursive: true,
  });
  const matrix = (
    await fs.promises.readdir(root, { withFileTypes: true, recursive: true })
  )
    .filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.toUpperCase() === "Dockerfile".toUpperCase()
    )
    .map((dirent) => {
      const part = dirent.path.split(path.sep).reverse();
      return {
        dockerfile: path.join(dirent.path, dirent.name),
        tag: `${part[2]}:${part[0]}`,
      };
    });
  console.info({
    githubWorkspace: root,
    matrix,
    matrix1,
    cd: path.resolve("./"),
  });
  return matrix;
};

console.info(await getMatrix("./"));

export { getMatrix };
