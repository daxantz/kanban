import Column from "@/components/Column";
import ColumnModal from "@/components/ColumnModal";

import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Home({ searchParams }: Props) {
  const { board: boardId } = await searchParams;
  const columns = await prisma.column.findMany({
    where: {
      boardId: boardId as string,
    },
    include: {
      tasks: {
        include: {
          subtasks: true,
        },
      },
    },
  });
  if (columns.length === 0)
    return (
      <div className="flex flex-col items-center px-4 border h-screen justify-center">
        <p className="text-medium-grey font-bold text-center mb-6">
          This board is empty. Create a new column to get started.
        </p>

        <ColumnModal hasCols={false} />
      </div>
    );

  return (
    <div className="px-4 py-6 flex gap-6  overflow-x-scroll bg-light-grey dark:bg-dark-grey">
      {columns.map((col) => (
        <Column column={col} key={col.name} />
      ))}
      <div className="flex flex-col gap-6">
        <div className="bg-transparent text-transparent">pcaeholder</div>
        <ColumnModal hasCols={true} />
      </div>
    </div>
  );
}
