const words = document.querySelectorAll('.word');

    // Set initial random positions
    words.forEach(word => {
      const maxX = window.innerWidth - word.offsetWidth;
      const maxY = window.innerHeight - word.offsetHeight;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      word.style.left = `${x}px`;
      word.style.top = `${y}px`;
    });

    // Gentle shake (every 100ms)
    setInterval(() => {
      words.forEach(word => {
        let x = parseFloat(word.style.left);
        let y = parseFloat(word.style.top);
        if (isNaN(x) || isNaN(y)) return;

        x += (Math.random() - 0.5) * 2; // shake within ±1px
        y += (Math.random() - 0.5) * 2;

        // keep within bounds
        const maxX = window.innerWidth - word.offsetWidth;
        const maxY = window.innerHeight - word.offsetHeight;
        x = Math.max(0, Math.min(maxX, x));
        y = Math.max(0, Math.min(maxY, y));

        word.style.left = `${x}px`;
        word.style.top = `${y}px`;
      });
    }, 100);

    // Big teleport (every 4 seconds)
    setInterval(() => {
      words.forEach(word => {
        const maxX = window.innerWidth - word.offsetWidth;
        const maxY = window.innerHeight - word.offsetHeight;
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        word.style.left = `${newX}px`;
        word.style.top = `${newY}px`;
      });
    }, 4000);
