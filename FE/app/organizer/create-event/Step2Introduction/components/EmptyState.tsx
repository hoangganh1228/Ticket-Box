export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-300">
      Chưa có suất diễn nào.
      <div className="mt-4">
        <button onClick={onCreate} className="inline-flex items-center text-green-500 hover:text-green-400">
          Tạo suất diễn
        </button>
      </div>
    </div>
  );
}
