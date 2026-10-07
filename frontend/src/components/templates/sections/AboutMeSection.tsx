import DOMPurify from 'dompurify';

export function AboutMeSection({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
