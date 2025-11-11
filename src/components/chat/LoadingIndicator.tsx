export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-zinc-100 text-zinc-900 rounded-lg px-4 py-2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
