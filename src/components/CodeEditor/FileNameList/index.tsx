/*
 * @Date: 2024-05-06 17:05:06
 * @Description: description
 */
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../../ReactPlayground/PlaygroundContext";

import { FileNameItem } from "./FileNameItem";
import styles from "./index.module.scss";

function FileNameList() {
  const { files, removeFile, addFile, updateFileName, selectedFileName, setSelectedFileName } =
    useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => (
        <FileNameItem
          key={item + index}
          value={item}
          actived={selectedFileName === item}
          onClick={() => setSelectedFileName(item)}
        ></FileNameItem>
      ))}
    </div>
  );
}

export default FileNameList;
