function calculateImposition() {
    const format = document.getElementById('format').value;
    const pagesInput = document.getElementById('pages').value;
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
  
    // Reset previous results
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    errorDiv.textContent = '';
    resultText.textContent = '';
  
    const numPages = parseInt(pagesInput, 10);
  
    if (!numPages || numPages <= 0) {
      errorDiv.textContent = 'Iltimos, sahifalar sonini kiriting.';
      errorDiv.classList.remove('hidden');
      return;
    }
  
    if (numPages % 4 !== 0) {
      errorDiv.textContent = 'Sahifalar soni 4 ga bo‘linishi kerak.';
      errorDiv.classList.remove('hidden');
      return;
    }
  
    let order = [];
  
    if (format === 'A6') {
      // A6 imposition: 4 pages per A5 sheet (doubled sequence)
      const sheets = numPages / 4;
      for (let i = 0; i < sheets; i++) {
        const frontLeft = numPages - (2 * i);
        const frontRight = 2 * i + 1;
        const backLeft = 2 * i + 2;
        const backRight = numPages - (2 * i + 1);
  
        order.push(
          frontLeft, frontRight, frontLeft, frontRight,
          backLeft, backRight, backLeft, backRight
        );
      }
    } else if (format === 'A5') {
      // A5 imposition: 2 pages per A4 sheet
      const groups = numPages / 4;
      for (let i = 0; i < groups; i++) {
        const index = 2 * i;
        order.push(numPages - index, index + 1, index + 2, numPages - (index + 1));
      }
    }
  
    resultText.textContent = order.join(',');
    resultDiv.classList.remove('hidden');
  }
  
  function copyToClipboard() {
    const resultTextElement = document.getElementById('result-text');
    const copyButton = document.querySelector('.copy-btn');
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
  
    if (!resultTextElement || !copyButton || !copyIcon || !checkIcon) {
      console.error('DOM elements not found');
      return;
    }
  
    const resultText = resultTextElement.textContent;
  
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    navigator.clipboard.writeText(resultText).then(
      () => {
        // Toggle to checkmark icon
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
        }, 1000);
      },
      (err) => {
        console.error('Clipboard write failed:', err);
      }
    );
  }