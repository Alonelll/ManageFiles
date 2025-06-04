import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import path from "path";
import postcssImport from "postcss-import";

const root = path.resolve(process.cwd(), "src", "style");

const aliases = {
  "@root": (fn) => `${root}/${fn}`,

  "@index": (fn) => {
    if (fn != undefined) {
      throw new Error("index alias should not have a file name");
    }
    return `${root}/index.css`;
  },
};

const aliasResolve = (id) => {
  const [alias, subpath] = id.split("/");

  if (!aliases[alias]) {
    return id;
  }

  return aliases[alias](subpath);
};

export default {
  plugins: [
    postcssImport({
      root: root,
      skipDuplicates: true,
      resolve: aliasResolve,
    }),
    autoprefixer(),
    tailwindcss(),
  ],
};
