/**
 * BG Remover - Cloudflare Worker
 * Handles image background removal via Remove.bg API
 */

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Serve frontend
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        return new Response(getHTML(), {
          headers: {
            'Content-Type': 'text/html;charset=utf-8',
            ...corsHeaders,
          },
        });
      }

      // Handle image processing
      if (request.method === 'POST' && url.pathname === '/remove-bg') {
        return await handleRemoveBg(request, env, corsHeaders);
      }

      // 404
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        detail: error.message,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

/**
 * Handle Remove.bg API request
 */
async function handleRemoveBg(request, env, corsHeaders) {
  // Get API key from environment
  const apiKey = env.REMOVE_BG_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return new Response(JSON.stringify({
      error: 'API key not configured',
      detail: 'Please configure your Remove.bg API key in wrangler.toml',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Parse multipart form data
  let imageData;
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    if (!imageFile) {
      return new Response(JSON.stringify({
        error: 'No image provided',
        detail: 'Please upload an image file',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    imageData = await imageFile.arrayBuffer();
  } else if (contentType.includes('application/json')) {
    // Also accept base64 encoded images
    const body = await request.json();
    if (body.image) {
      // Assume base64 if it contains data URI or is raw base64
      let base64Data = body.image;
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }
      imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;
    } else {
      return new Response(JSON.stringify({
        error: 'No image provided',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  } else {
    return new Response(JSON.stringify({
      error: 'Invalid content type',
      detail: 'Please use multipart/form-data or application/json',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Call Remove.bg API
  const removeBgFormData = new FormData();
  removeBgFormData.append('image_file', new Blob([imageData]));
  removeBgFormData.append('size', 'auto');
  removeBgFormData.append('format', 'png');

  const response = await fetch(REMOVE_BG_API_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: removeBgFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Remove.bg API error:', errorText);

    // Check for specific error codes
    let errorMessage = 'Failed to remove background';
    if (response.status === 402) {
      errorMessage = 'API credits exhausted';
    } else if (response.status === 403) {
      errorMessage = 'Invalid API key';
    }

    return new Response(JSON.stringify({
      error: errorMessage,
      detail: errorText,
    }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Return the processed image
  const resultBuffer = await response.arrayBuffer();
  return new Response(resultBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="removed-bg.png"',
      ...corsHeaders,
    },
  });
}

/**
 * Get the HTML frontend
 */
function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BG Remover - Remove Image Backgrounds</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    header {
      text-align: center;
      padding: 30px 0;
      color: white;
    }

    header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .upload-area {
      background: white;
      border-radius: 15px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 3px dashed #ddd;
    }

    .upload-area:hover, .upload-area.dragover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .upload-area .icon {
      font-size: 4rem;
      margin-bottom: 15px;
    }

    .upload-area h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .upload-area p {
      color: #666;
    }

    .upload-area .formats {
      margin-top: 15px;
      font-size: 0.9rem;
      color: #999;
    }

    #fileInput {
      display: none;
    }

    .preview-area {
      display: none;
      gap: 20px;
      margin-top: 30px;
    }

    .preview-area.visible {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 640px) {
      .preview-area.visible {
        grid-template-columns: 1fr;
      }
    }

    .preview-box {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .preview-box h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }

    .preview-box .image-container {
      background: repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 20px 20px;
      border-radius: 10px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .preview-box img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 10px;
    }

    .actions {
      display: none;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }

    .actions.visible {
      display: flex;
    }

    button {
      padding: 15px 40px;
      font-size: 1.1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
      transform: translateY(-2px);
    }

    .loading {
      display: none;
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .loading.visible {
      display: block;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      display: none;
      background: #fee;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 15px;
      border-radius: 10px;
      margin-top: 20px;
      text-align: center;
    }

    .error.visible {
      display: block;
    }

    footer {
      text-align: center;
      padding: 20px;
      color: white;
      opacity: 0.8;
    }

    footer a {
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🖼️ BG Remover</h1>
      <p>Remove image backgrounds with AI</p>
    </header>

    <main>
      <div class="upload-area" id="uploadArea">
        <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp">
        <div class="icon">📁</div>
        <h2>Click or drag image to upload</h2>
        <p>Your image will be processed immediately</p>
        <div class="formats">Supports JPG, PNG, WebP • Max 10MB</div>
      </div>

      <div class="preview-area" id="previewArea">
        <div class="preview-box">
          <h3>Original</h3>
          <div class="image-container">
            <img id="originalPreview" alt="Original">
          </div>
        </div>
        <div class="preview-box">
          <h3>Result</h3>
          <div class="image-container">
            <img id="resultPreview" alt="Result" style="display:none;">
          </div>
        </div>
      </div>

      <div class="loading" id="loading">
        <div class="spinner"></div>
        <p>Removing background...</p>
      </div>

      <div class="error" id="error"></div>

      <div class="actions" id="actions">
        <button class="btn-primary" id="processBtn">✨ Remove Background</button>
        <button class="btn-success" id="downloadBtn" style="display:none;">⬇️ Download</button>
      </div>
    </main>

    <footer>
      <p>Powered by <a href="https://www.remove.bg/" target="_blank">Remove.bg</a> • <a href="https://workers.cloudflare.com/" target="_blank">Cloudflare Workers</a></p>
    </footer>
  </div>

  <script>
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const resultPreview = document.getElementById('resultPreview');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const actions = document.getElementById('actions');
    const processBtn = document.getElementById('processBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFile = null;
    let resultBlob = null;

    // Upload area click
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    // Handle file selection
    function handleFile(file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showError('Only JPG, PNG, and WebP formats are supported');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }

      selectedFile = file;
      hideError();

      // Show original preview
      const reader = new FileReader();
      reader.onload = (e) => {
        originalPreview.src = e.target.result;
        previewArea.classList.add('visible');
        actions.classList.add('visible');
        resultPreview.style.display = 'none';
        downloadBtn.style.display = 'none';
        processBtn.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }

    // Process button click
    processBtn.addEventListener('click', async () => {
      if (!selectedFile) return;

      processBtn.disabled = true;
      processBtn.textContent = '⏳ Processing...';
      loading.classList.add('visible');
      hideError();

      try {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await fetch('/remove-bg', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process image');
        }

        resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);
        resultPreview.src = resultUrl;
        resultPreview.style.display = 'block';

        downloadBtn.style.display = 'block';
      } catch (err) {
        showError(err.message || 'An error occurred while processing');
        resultPreview.style.display = 'none';
      } finally {
        loading.classList.remove('visible');
        processBtn.disabled = false;
        processBtn.textContent = '✨ Remove Background';
      }
    });

    // Download button click
    downloadBtn.addEventListener('click', () => {
      if (!resultBlob) return;

      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace(/\\.[^/.]+$/, '') + '_nobg.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    function showError(message) {
      error.textContent = message;
      error.classList.add('visible');
    }

    function hideError() {
      error.classList.remove('visible');
    }
  </script>
</body>
</html>`;
}
