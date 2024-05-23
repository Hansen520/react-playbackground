/*
 * @Date: 2024-05-06 16:51:00
 * @Description: description
 */
import logoSvg from "../../assets/react.svg";
import styles from "./index.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt="logo" src={logoSvg} />
        <span>我的线上React代码编辑器</span>
      </div>
    </div>
  );
}
