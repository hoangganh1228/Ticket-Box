'use client';

import dynamic from 'next/dynamic';
type Props = { value: string; onChange: (v: string) => void; placeholder?: string };

const TinyEditor = dynamic(
  async () => (await import('@tinymce/tinymce-react')).Editor,
  { ssr: false }
);

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  return (
    <TinyEditor
      apiKey={apiKey}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 360,
        menubar: false,
        branding: false,
        statusbar: true,
        placeholder: placeholder ?? 'Nhập nội dung…',
        plugins:
          'lists link image media table code codesample preview fullscreen hr charmap emoticons wordcount',
        toolbar:
          'undo redo | blocks fontsize | bold italic underline | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media table | ' +
          'removeformat | code preview fullscreen',
        skin: 'oxide',
        content_css: 'default',
        paste_data_images: true,
        // Nếu muốn upload ảnh qua API của bạn:
        images_upload_handler: async (blobInfo, progress) => {
          const form = new FormData();
          form.append('file', blobInfo.blob(), blobInfo.filename());
          const res = await fetch('/api/uploads', { method: 'POST', body: form });
          if (!res.ok) throw new Error('Upload failed');
          const { url } = await res.json();
          return url;
        },
      }}
    />
  );
}
