function toggleInputs() {
  const mode = document.getElementById('mode').value;
  const fullBookInputs = document.getElementById('full-book-inputs');
  const pageRangeInputs = document.getElementById('page-range-inputs');

  if (mode === 'full') {
    fullBookInputs.classList.remove('hidden');
    pageRangeInputs.classList.add('hidden');
  } else {
    fullBookInputs.classList.add('hidden');
    pageRangeInputs.classList.remove('hidden');
  }
}

function calculateImposition() {
  const mode = document.getElementById('mode').value;
  const format = document.getElementById('format').value;
  const errorDiv = document.getElementById('error');
  const resultDiv = document.getElementById('result');
  const resultText = document.getElementById('result-text');

  // Reset previous results
  errorDiv.classList.add('hidden');
  resultDiv.classList.add('hidden');
  errorDiv.textContent = '';
  resultText.textContent = '';

  if (mode === 'full') {
    const pagesInput = document.getElementById('pages').value;
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
      const groups = numPages / 4;
      for (let i = 0; i < groups; i++) {
        const index = 2 * i;
        order.push(numPages - index, index + 1, index + 2, numPages - (index + 1));
      }
    }

    resultText.textContent = order.join(',');
    resultDiv.classList.remove('hidden');
  } else {
    const totalPagesInput = document.getElementById('total-pages').value;
    const startPageInput = document.getElementById('start-page').value;
    const endPageInput = document.getElementById('end-page').value;

    const totalPages = parseInt(totalPagesInput, 10);
    const startPage = parseInt(startPageInput, 10);
    const endPage = parseInt(endPageInput, 10);

    // Validation
    if (!totalPages || totalPages <= 0) {
      errorDiv.textContent = 'Iltimos, umumiy sahifalar sonini kiriting.';
      errorDiv.classList.remove('hidden');
      return;
    }
    if (!startPage || startPage <= 0) {
      errorDiv.textContent = 'Iltimos, boshlang‘ich sahifani kiriting.';
      errorDiv.classList.remove('hidden');
      return;
    }
    if (!endPage || endPage <= 0) {
      errorDiv.textContent = 'Iltimos, oxirgi sahifani kiriting.';
      errorDiv.classList.remove('hidden');
      return;
    }
    if (startPage > endPage) {
      errorDiv.textContent = 'Boshlang‘ich sahifa oxirgi sahifadan kichik bo‘lishi kerak.';
      errorDiv.classList.remove('hidden');
      return;
    }
    if (startPage > totalPages || endPage > totalPages) {
      errorDiv.textContent = 'Kiritilgan sahifalar umumiy sahifalar sonidan oshmasligi kerak.';
      errorDiv.classList.remove('hidden');
      return;
    }

    const numPages = endPage - startPage + 1;
    if (numPages % 4 !== 0) {
      errorDiv.textContent = 'Tanlangan sahifalar soni 4 ga bo‘linishi kerak.';
      errorDiv.classList.remove('hidden');
      return;
    }

    let order = [];

    if (format === 'A6') {
      const sheets = numPages / 4;
      for (let i = 0; i < sheets; i++) {
        const frontLeft = numPages - (2 * i);
        const frontRight = 2 * i + 1;
        const backLeft = 2 * i + 2;
        const backRight = numPages - (2 * i + 1);

        const origFrontLeft = startPage + frontLeft - 1;
        const origFrontRight = startPage + frontRight - 1;
        const origBackLeft = startPage + backLeft - 1;
        const origBackRight = startPage + backRight - 1;

        order.push(
          origFrontLeft, origFrontRight, origFrontLeft, origFrontRight,
          origBackLeft, origBackRight, origBackLeft, origBackRight
        );
      }
    } else if (format === 'A5') {
      const groups = numPages / 4;
      for (let i = 0; i < groups; i++) {
        const index = 2 * i;
        const page1 = numPages - index;
        const page2 = index + 1;
        const page3 = index + 2;
        const page4 = numPages - (index + 1);

        const origPage1 = startPage + page1 - 1;
        const origPage2 = startPage + page2 - 1;
        const origPage3 = startPage + page3 - 1;
        const origPage4 = startPage + page4 - 1;

        order.push(origPage1, origPage2, origPage3, origPage4);
      }
    }

    resultText.textContent = order.join(',');
    resultDiv.classList.remove('hidden');
  }
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

document.addEventListener('DOMContentLoaded', toggleInputs);