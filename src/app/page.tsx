import { getComputers } from "@/lib/actions";
import { ComputerTableClient } from "@/components/computer-table-client";

export const dynamic = 'force-dynamic'; // Ensure page is re-rendered on each request

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { computers, totalPages, totalCount } = await getComputers(currentPage);

  return (
    <ComputerTableClient 
      initialComputers={computers} 
      totalPages={totalPages}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
}
