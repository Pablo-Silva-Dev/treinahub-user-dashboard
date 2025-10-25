import emptyBox from "../../../assets/empty_box.svg";

interface NoDataProps {
  description?: string;
}

export const NoData: React.FC<NoDataProps> = ({ description }) => {
  return (
    <div className="flex flex-col gap-2 mx-auto">
      <img
        src={emptyBox}
        alt="No Data"
        className="mx-auto w-24 aspect-square "
      />
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        {description || "Sem dados para exibir"}
      </p>
    </div>
  );
};
