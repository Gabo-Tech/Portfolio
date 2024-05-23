import React from "react";
import TimelineItem from "./timelineItem";

/**
 * TimelineList Component
 * Displays a list of timeline items.
 *
 * @param {Array} experiences - Array of experience objects containing title, description, date, and company.
 * @param {boolean} isInView - Flag to indicate if the timeline is in view.
 */
const TimelineList = ({ experiences, isInView }) => (
  <div role="list">
    {experiences.map((exp, index) => (
      <TimelineItem
        key={index}
        title={exp.title}
        description={exp.description}
        date={exp.date}
        company={exp.company}
        alternate={index % 2 !== 0}
        isInView={isInView}
      />
    ))}
  </div>
);

export default TimelineList;
