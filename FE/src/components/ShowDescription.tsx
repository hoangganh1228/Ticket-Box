type ShowProps = {
  description: string; // nội dung HTML trả về từ backend
};

export default function ShowDescription({ description }: ShowProps) {

  const html = description?.replace(/\n/g, '<br/>'); // chuyển newline thành <br>

  return (
    <div
      className="prose max-w-none" // tailwind để format đẹp
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
