'use client';

interface HtmlContentProps {
  content: string;
  className?: string;
}

export default function HtmlContent({ content, className = '' }: HtmlContentProps) {
  if (!content || content === '<p></p>') return null;

  return (
    <>
      <div
        className={`prose prose-invert prose-sm max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <style jsx global>{`
        .prose h1 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0.25rem 0;
          color: #F1F5F9;
        }
        .prose h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.25rem 0;
          color: #F1F5F9;
        }
        .prose p {
          margin: 0.125rem 0;
          color: #94A3B8;
        }
        .prose ul {
          padding-left: 1.25rem;
          margin: 0.125rem 0;
          color: #94A3B8;
          list-style-type: disc;
        }
        .prose ol {
          padding-left: 1.25rem;
          margin: 0.125rem 0;
          color: #94A3B8;
          list-style-type: decimal;
        }
        .prose li {
          margin: 0;
        }
        .prose li::marker {
          color: #64748B;
        }
        .prose strong {
          font-weight: 700;
          color: #F1F5F9;
        }
        .prose em {
          font-style: italic;
        }
        .prose a {
          color: #3B82F6;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #60A5FA;
        }
      `}</style>
    </>
  );
}
