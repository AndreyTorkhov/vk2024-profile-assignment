import React from "react";
import styles from "./styles/App.module.css";
import { DynamicHeight } from "./page/MainPage";

const App: React.FC = () => (
  <div className={styles.app}>
    <h1>GitHub List</h1>
    <DynamicHeight />
  </div>
);

export default App;
