import React, { useMemo } from "react";
import TimelineItem from "./timelineItem";

/**
 * TimelineList Component
 * Displays a list of timeline items.
 *
 * @param {Array} experiences - Array of experience objects containing title, description, date, and company.
 * @param {boolean} isInView - Flag to indicate if the timeline is in view.
 */
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
