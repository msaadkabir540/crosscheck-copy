const types = {
  images: { 'image/*': ['.jpg', '.jpeg', '.png', '.svg', '.svg+xml', '.webp', '.gif', '.ico', '.gif', '.bmp'] },
  text: { 'text/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.md', '.rtf'] },
  video: { 'video/*': ['.mp4', '.mov', '.wmv', '.mkv'] },
  application: { 'application/*': ['.x-zip-compressed'] },
};

export default types;
