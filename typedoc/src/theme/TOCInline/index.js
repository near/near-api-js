import React from 'react';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
export default function TOCInline({toc, minHeadingLevel, maxHeadingLevel}) {
  return (
    <div className={styles.tableOfContentsInline}>
      <TOCItems
        toc={toc}
        minHeadingLevel={minHeadingLevel}
        maxHeadingLevel={maxHeadingLevel}
        className="table-of-contents"
        linkClassName={null}
      />
    </div>
  );
}
