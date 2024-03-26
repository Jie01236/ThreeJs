import JSZip from 'jszip';

export async function downloadZip(files) {
    const zip = new JSZip();
    // 假设 files 是一个对象数组，每个对象都有 name 和 content 属性
    files.forEach(file => {
        zip.file(file.name, file.content);
    });

    // 生成 ZIP 文件并触发下载
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'example.zip'; // 设置你想要的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
