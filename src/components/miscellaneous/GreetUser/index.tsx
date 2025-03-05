interface GreetUserProps {
  userName: string;
}

export default function GreetUser({ userName }: GreetUserProps) {
  return (
    <div className="flex w-full mb-4 items-center">
      <span className="text-sm xl:text-md text-gray-700 dark:text-gray-100">
        Olá,
      </span>
      <strong className="text-md xl:text-lg text-black dark:text-white font-bold  ml-2">
        {userName}
      </strong>
    </div>
  );
}
