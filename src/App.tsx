import React from "react";
import styles from "./styles/App.module.css";
import { DynamicHeight } from "./components/MainPage";

const App: React.FC = () => (
  <div className={styles.app}>
    <h1>Комментарии</h1>
    <DynamicHeight />
  </div>
);

export default App;
