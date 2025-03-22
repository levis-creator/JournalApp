import JournalDetails from '@/components/journal/JournalDetails';

export default function JournalModal({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const journalId = searchParams.id;

  if (!journalId) {
    return <div>Journal not found</div>;
  }

  return (
    <div className="p-4">
      <JournalDetails id={parseInt(journalId)} />
    </div>
  );
}