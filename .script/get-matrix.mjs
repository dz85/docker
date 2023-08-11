// `actions/github-script@v6` don't support npm in this file

import path from "node:path";
import fs from "node:fs";

const getMatrix = async (githubWorkspace) => {
  const matrix = (
    await fs.promises.readdir(githubWorkspace, {
      withFileTypes: true,
      recursive: true,
    })
  )
    .filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.toUpperCase() === "Dockerfile".toUpperCase()
    )
    .map((dirent) => {
      const part = dirent.path.split(path.sep);
      return {
        dockerfile: path.join(dirent.path, dirent.name),
        tag: `${part[0]}:${part[2]}`,
      };
    });
  console.info({ githubWorkspace, matrix });
  return matrix;
};

console.info(await getMatrix("./"));

export { getMatrix };
