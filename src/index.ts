import * as htmlPlugin from "vite-plugin-html-config";
import { ServerOptions } from "vite";

type Proxy = ServerOptions['proxy'];

export interface UrbitPluginConfig extends Proxy {
  /**
   * The base that this app will be served at. This should be the same
   * as the `base` property on the docket file
   */
  base: string;
  /**
   * URL of urbit to proxy requests to
   *
   * @example `"http://localhost:8080"`
   */
  target: string;
}

const UrbitProxyPlugin = ({ base, target, ...options }: UrbitPluginConfig) => {
  const basePath = `/apps/${base}/`;
  return {
    name: "return-partial",
    config: () => ({
      base: basePath,
      server: {
        proxy: {
          [`^${basePath}desk.js`]: {
            target,
            options
          },
          [`^((?!${basePath}).)*$`]: {
            target,
            options
          },
        },
      },
    }),
  };
};

/**
 * Setup a vite dev server for urbit development
 *
 */
export const urbitPlugin = (config: UrbitPluginConfig) => {
  const htmlPluginOpt = {
    headScripts: [
      { src: `/apps/${config.base}/desk.js` },
      { src: "/session.js" },
    ],
  };

  return [UrbitProxyPlugin(config), htmlPlugin(htmlPluginOpt)];
};
