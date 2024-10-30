import React from "react";
// import NewsList from "./components/NewsList/NewsList";
import styles from "./styles/App.module.css";
import { DynamicHeight } from "./components/Simple";

const App: React.FC = () => (
  <div className={styles.app}>
    <h1>Новости</h1>
    <DynamicHeight />
  </div>
);

export default App;
