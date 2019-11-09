const fileInput = document.querySelector('.panel input.file-input');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('.panel .file-name-text');
    fileName.textContent = fileInput.files[0].name;
  }
}