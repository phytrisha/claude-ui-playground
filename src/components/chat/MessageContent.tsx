import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MessageContentProps {
  content: string;
  role: 'user' | 'assistant';
}

export function MessageContent({ content, role }: MessageContentProps) {
  // For user messages, just display as plain text
  if (role === 'user') {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  // For assistant messages, render markdown with syntax highlighting
  return (
    <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customize code blocks
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className?.includes('language-');

            return !isInline ? (
              <div className="relative">
                {match && (
                  <div className="absolute right-2 top-2 text-xs text-zinc-400 uppercase">
                    {match[1]}
                  </div>
                )}
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-zinc-200 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          // Customize links to open in new tab
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Customize paragraphs for better spacing
          p({ children, ...props }: any) {
            return (
              <p className="mb-2 last:mb-0" {...props}>
                {children}
              </p>
            );
          },
          // Customize lists
          ul({ children, ...props }: any) {
            return (
              <ul className="list-disc pl-4 mb-2 space-y-1" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="list-decimal pl-4 mb-2 space-y-1" {...props}>
                {children}
              </ol>
            );
          },
          // Customize headings
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-lg font-bold mt-3 mb-2 first:mt-0" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-base font-bold mt-2 mb-1 first:mt-0" {...props}>
                {children}
              </h3>
            );
          },
          // Customize blockquotes
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                className="border-l-4 border-zinc-300 pl-4 italic my-2"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Customize tables
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-zinc-300 px-3 py-2 bg-zinc-100 font-semibold text-left" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-zinc-300 px-3 py-2" {...props}>
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
