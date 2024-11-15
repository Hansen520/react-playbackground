/*
 * @Date: 2024-05-06 16:51:00
 * @Description: description
 */
import logoSvg from "../../assets/react.svg";
import styles from "./index.module.scss";

import { useContext } from "react";
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext";
import { MoonOutlined, SunOutlined, ShareAltOutlined, DownloadOutlined } from "@ant-design/icons";

import copy from "copy-to-clipboard";
import { message } from "antd";

import { downloadFile } from "../../ReactPlayground/utils";

export default function Header() {
  const { files, theme, setTheme } = useContext(PlaygroundContext);
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt="logo" src={logoSvg} />
        <span>HS's React 线上编辑器</span>
      </div>
      <div className={styles.links}>
        {theme === "light" && (
          <MoonOutlined title="切换暗色主题" className={styles.theme} onClick={() => setTheme("dark")} />
        )}
        {theme === "dark" && (
          <SunOutlined title="切换亮色主题" className={styles.theme} onClick={() => setTheme("light")} />
        )}
        <ShareAltOutlined
          style={{ marginLeft: "10px" }}
          onClick={() => {
            copy(window.location.href);
            message.success("已复制到剪贴板");
          }}
        />
        <DownloadOutlined
          style={{ marginLeft: "10px" }}
          onClick={async () => {
            await downloadFile(files);
            message.success("下载完成");
          }}
        />
      </div>
    </div>
  );
}
