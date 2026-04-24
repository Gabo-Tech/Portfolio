import React, { useMemo } from "react";
import TimelineItem from "./timelineItem";
const TimelineList = ({ experiences, isInView }) => {
  const memoizedTimelineItems = useMemo(() => {
    return experiences.map((exp, index) => (
      <TimelineItem
        key={exp.id || index}
        title={exp.title}
        description={exp.description}
        date={exp.date}
        company={exp.company}
        alternate={index % 2 !== 0}
        isInView={isInView}
      />
    ));
  }, [experiences, isInView]);
  return <div role="list">{memoizedTimelineItems}</div>;
};
export default TimelineList;
