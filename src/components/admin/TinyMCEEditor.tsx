import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export default function TinyMCEEditor({ value, onChange, height = 500 }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  const contentStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');

    html { background: #ffffff; }

    body.blog-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 28px;
      color: #343434;
      font-family: "GT Alpina", "Cormorant Garamond", Georgia, serif !important;
      font-size: 20px;
      font-weight: 400;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }

    body.blog-content * {
      font-family: inherit !important;
    }

    .blog-content p { margin: 0 0 1.25em; }

    .blog-content h1,
    .blog-content h2,
    .blog-content h3,
    .blog-content h4,
    .blog-content h5,
    .blog-content h6 {
      margin: 1.45em 0 0.55em;
      color: #111111;
      font-family: "GT Alpina", "Cormorant Garamond", Georgia, serif !important;
      font-weight: 500;
      line-height: 1.15;
    }

    .blog-content h1 { font-size: 2.6em; }
    .blog-content h2 { font-size: 2.05em; }
    .blog-content h3 { font-size: 1.65em; }
    .blog-content h4 { font-size: 1.35em; }
    .blog-content h5 { font-size: 1.15em; }
    .blog-content h6 { font-size: 1em; text-transform: uppercase; letter-spacing: 0.08em; }

    .blog-content ul,
    .blog-content ol {
      display: block !important;
      margin: 0 0 1.35em;
      padding-left: 1.65em;
      list-style-position: outside !important;
    }

    .blog-content ul { list-style-type: disc !important; }
    .blog-content ol { list-style-type: decimal !important; }
    .blog-content ul ul { list-style-type: circle !important; }
    .blog-content ul ul ul { list-style-type: square !important; }
    .blog-content ol ol { list-style-type: lower-alpha !important; }

    .blog-content li {
      display: list-item !important;
      margin: 0.35em 0;
      padding-left: 0.2em;
    }

    .blog-content li::marker {
      color: currentColor;
      font-size: 0.9em;
    }

    .blog-content li > ul,
    .blog-content li > ol {
      margin-top: 0.35em;
      margin-bottom: 0.35em;
    }

    .blog-content strong,
    .blog-content b {
      color: #111111;
      font-weight: 700;
    }

    .blog-content blockquote {
      margin: 1.75em 0;
      padding: 0.3em 0 0.3em 1.35em;
      border-left: 3px solid #C6A15B;
      color: #5f5b55;
      font-family: "GT Alpina", "Cormorant Garamond", Georgia, serif !important;
      font-size: 1.25em;
      font-style: italic;
      line-height: 1.5;
    }

    .blog-content a {
      color: #8f6d2f;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .blog-content img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 2em auto;
      border-radius: 18px;
    }

    .blog-content figure { margin: 2em 0; }
    .blog-content figure img { margin: 0 auto; }

    .blog-content figcaption {
      margin-top: 0.7em;
      color: #77736d;
      font-size: 0.82em;
      text-align: center;
    }

    .blog-content table {
      width: 100%;
      margin: 1.75em 0;
      border-collapse: collapse;
      font-size: 0.94em;
    }

    .blog-content th,
    .blog-content td {
      padding: 0.75em 0.9em;
      border: 1px solid #d9d6d1;
      text-align: left;
      vertical-align: top;
    }

    .blog-content th {
      background: #f1efe9;
      color: #111111;
      font-weight: 600;
    }

    .blog-content hr {
      margin: 2.25em 0;
      border: 0;
      border-top: 1px solid #d9d6d1;
    }

    .blog-content pre {
      max-width: 100%;
      padding: 1em;
      overflow-x: auto;
      border-radius: 12px;
      background: #111111;
      color: #ffffff;
    }
  `;
  
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white relative">
      <style>{`
        .tox-promotion { display: none !important; }
        .tox-notification { display: none !important; }
      `}</style>
      <Editor
        apiKey="gq66xcsb5xucof3qirjzqdxh9jznlpaf6uyr4r6vu6sz581b"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'image'
          ],
          toolbar: 'undo redo | blocks fontsize | ' +
            'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link image media table hr | removeformat | preview fullscreen',
          body_class: 'blog-content',
          content_style: contentStyle,
          block_formats: 'Akapit=p; Nagłówek 1=h1; Nagłówek 2=h2; Nagłówek 3=h3; Nagłówek 4=h4; Nagłówek 5=h5; Nagłówek 6=h6',
          font_size_formats: '12px 14px 16px 17px 18px 20px 24px 28px 32px 40px 48px',
          image_caption: true,
          image_advtab: true,
          automatic_uploads: true,
          paste_data_images: true,
          file_picker_types: 'image',
          relative_urls: false,
          remove_script_host: false,
          document_base_url: window.location.origin + '/',
          images_upload_handler: async (blobInfo, progress) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('image', blobInfo.blob(), blobInfo.filename());

              fetch("/api/upload", {
                method: 'POST',
                headers: {
                  "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: formData
              })
              .then(async r => {
                const res = await r.json();
                if (!r.ok) {
                  reject(res.error || 'Upload failed');
                  return;
                }
                if (res.url) {
                  resolve(res.url);
                } else {
                  reject('Upload failed');
                }
              })
              .catch(err => reject('HTTP Error: ' + err.message));
            });
          }
        }}
      />
    </div>
  );
}
