import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

interface MetricsCardProps {
  title: string;
  metric: number;
  iconName: string;
  link: string;
}

export default function MetricsCard({
  title,
  metric,
  iconName,
  link,
}: MetricsCardProps) {
  const ANIMATION_REASON = 1.25;
  const metricsInitialValue = metric / ANIMATION_REASON;

  return (
    <Link to={link}>
      <div className="flex w-full justify-evenly mr-3  border-1 border-gray-300 dark:border-gray-800 shadow-sm bg-white dark:bg-slate-700  rounded-lg items-center p-4">
        <CountUp
          start={metricsInitialValue}
          end={metric}
          separator="."
          redraw={false}
          className="text-black dark:text-white text-xl xl:text-3xl font-bold"
        />
        <div className="flex items-center">
          <FeatherIcon
            icon={iconName}
            size={40}
            className="text-secondary m-2"
            strokeWidth={1}
          />
          <span className="text-sm xl:text-md text-gray-700 dark:text-gray-100 font-regular">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}
