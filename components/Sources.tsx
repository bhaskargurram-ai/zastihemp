import SourceCard from "./SourceCard";

export default function Sources({
  sources,
  isLoading,
}: {
  sources: { name: string; url: string }[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {isLoading ? (
        <>
          {/* Loading state for sources */}
          <div className="h-20 w-20 animate-pulse rounded-md bg-green-600" />
          <div className="h-20 w-20 animate-pulse rounded-md bg-green-600" />
          <div className="h-20 w-20 animate-pulse rounded-md bg-green-600" />
        </>
      ) : sources.length > 0 ? (
        sources.map((source) => (
          <SourceCard source={source} key={source.url} />
        ))
      ) : (
        <p className="text-sm text-gray-300">No sources available.</p>
      )}
    </div>
  );
}
