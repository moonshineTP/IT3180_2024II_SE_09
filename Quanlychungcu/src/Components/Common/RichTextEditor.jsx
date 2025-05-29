// ./Components/Common/RichTextEditor.jsx
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Classic build thường có sẵn các plugin FontColor, FontBackgroundColor
import './RichTextEditor.css'
const editorConfiguration = {
    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDg3MzU5OTksImp0aSI6IjExZmZlN2JiLWQ5ZjUtNDQ4NS1iMTdlLTIzNjI5Y2VkMjNhMiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjdkMjZlNWYwIn0.lsgzlsYKUTN_kVq4LaCmSKKepF8VgAuL_F1iKyHoBl7Q7-EHjAOt1xiemv_DPJ8zc7ZgPU3vkHUY5riLMcdzow',
    toolbar: [
        'heading', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|', // Thêm gạch chân, gạch ngang nếu muốn
        'link', '|',
        'bulletedList', 'numberedList', 'blockQuote', '|', // Thêm blockQuote nếu muốn
        'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|', // <-- THÊM Ở ĐÂY (cả font family, size nếu muốn)
        'alignment', '|', // Thêm căn lề nếu muốn
        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|', // Thêm các nút thao tác với bảng
        // 'imageUpload', // Tạm thời bỏ qua nếu chưa có backend
        'mediaEmbed', '|', // Cho phép nhúng video, etc.
        'undo', 'redo', '|',
        'removeFormat', // Thêm nút xóa định dạng
        'sourceEditing' // Thêm nút xem/sửa mã HTML (rất hữu ích khi debug)
    ],
    image: {
        toolbar: [
            'imageTextAlternative',
            // Nếu bạn chỉ cho chèn qua URL, không cần các style phức tạp hoặc linkImage ở đây.
            // Nếu sau này có upload, bạn có thể thêm: 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', 'linkImage'
        ]
    },
    mediaEmbed : {
        previewsInData: true
    },
    // (Không bắt buộc, nhưng tốt để có) Cấu hình màu sắc cho FontColor và FontBackgroundColor
    fontColor: {
        colors: [
            { color: 'hsl(0, 0%, 0%)', label: 'Black' },
            { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
            { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
            { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
            { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
            { color: 'hsl(0, 75%, 60%)', label: 'Red' },
            { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
            { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
            { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
            { color: 'hsl(120, 75%, 60%)', label: 'Green' },
            { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
            { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
            { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
            { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
            { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ],
        // columns: 5, // Số cột trong bảng chọn màu
        // documentColors: 10, // Số màu gần đây được sử dụng trong document
    },
    fontBackgroundColor: {
        colors: [
            // Tương tự như fontColor, bạn có thể định nghĩa bảng màu ở đây
            { color: 'hsl(0, 75%, 60%)', label: 'Red' },
            { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
            { color: 'hsl(120, 75%, 60%)', label: 'Green' },
            { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
            { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true }, // White background
            { color: 'hsl(0, 0%, 0%)', label: 'Black' } // Black background
        ]
    },
    fontSize: { // Cấu hình các kích thước font nếu bạn dùng 'fontSize'
        options: [
            9,
            10,
            11,
            12,
            13,
            'default',
            15,
            16,
            17,
            18,
            19,
            20,
            21
        ],
        supportAllValues: true
    },
    fontFamily: { // Cấu hình các font nếu bạn dùng 'fontFamily'
        options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif'
        ],
        supportAllValues: true
    },
    // licenseKey: '', // Bỏ trống nếu chỉ dùng tính năng miễn phí
};

const RichTextEditor = ({ data, onChange, disabled }) => {
    // ... (phần còn lại của component như cũ) ...
    return (
        <div className={`custom-ckeditor-container ${disabled ? 'disabled' : ''}`}>
            <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data={data || ''}
                onChange={(_event, editor) => {
                    const editorData = editor.getData();
                    if (onChange) {
                        onChange(editorData);
                    }
                }}
                disabled={disabled}
            />
        </div>
    );
};

export default RichTextEditor;