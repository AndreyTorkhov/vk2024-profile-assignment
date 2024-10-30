import React from "react";
import { NewsItemType } from "../../types";
import styles from "../../styles/NewsItem.module.css";

const NewsItem: React.FC<{ news: NewsItemType; index: number }> = ({
  news,
  index,
}) => (
  <div className={styles.newsItem}>
    {/* <h3>{news.title}</h3> */}
    {index}.
    <span>
      Источник: {news.domain}, {news.sourcecountry}
    </span>
  </div>
);

export default NewsItem;
