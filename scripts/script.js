document.addEventListener('DOMContentLoaded', () => {

    const pCount = document.querySelectorAll('p').length;
    console.log('Кількість <p>:', pCount);

    const h2Count = document.querySelectorAll('h2').length;
    console.log('Кількість <h2>:', h2Count);

    const bodyBg = getComputedStyle(document.body).backgroundColor;
    console.log('background-color <body>:', bodyBg);

    const h1 = document.querySelector('h1');
    if (h1) {
        const h1FontSize = getComputedStyle(h1).fontSize;
        console.log('font-size <h1>:', h1FontSize);
    }

    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        let oldBg;

        el.addEventListener('mouseenter', () => {
            oldBg = el.style.backgroundColor;
            el.style.backgroundColor = 'red';
        });

        el.addEventListener('mouseleave', () => {
            el.style.backgroundColor = oldBg;
        });
    });

    setTimeout(loadImages, 5000);

    function loadImages() {
        const imagesUrl = [
            "https://picsum.photos/300/200?random=1",
            "https://picsum.photos/300/200?random=2",
            "https://picsum.photos/300/200?random=3",
            "https://picsum.photos/300/200?random=4"
        ];

        const parent = document.querySelector('.game-thumbnails');
        if (!parent) return;

        imagesUrl.forEach((url, index) => {
            setTimeout(() => {
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '250px';
                img.style.margin = '10px';

                parent.appendChild(img);
            }, index * 1000);
        });
    }

    // ✅ КОД З КНОПКОЮ ТУТ
    const usedWords = new Set();
    const checkBtn = document.getElementById("checkBtn");

    if (checkBtn) {
        checkBtn.addEventListener("click", () => {
            const input = document.getElementById("wordInput");
            const msg = document.getElementById("message");

            const word = input.value.trim().toLowerCase();

            if (word === "") {
                msg.textContent = "Введіть слово!";
                return;
            }

            if (usedWords.has(word)) {
                msg.textContent = `⚠️ Слово "${word}" вже було введено`;
            } else {
                usedWords.add(word);
                msg.textContent = `✅ Слово "${word}" додано`;
            }

            input.value = "";
        });
    }

});
function addImagesToPage() {
    console.log("5 секунд минуло! Починаємо додавати зображення...");

    const imagesUrl = [
        "/Games/mal1.jpg",
        "/Games/mal2.jpg",
    ];

    const parentElement = document.querySelector(".mal");
    if (!parentElement) return;

    const imagesContainer = document.createElement("div");
    imagesContainer.className = "images-gallery";
    imagesContainer.innerHTML = "<h2>Динамічна галерея зображень</h2>";

    document.head.insertAdjacentHTML("beforeend", `
        <style>
        .images-gallery { margin-top: 40px; padding: 30px; background: #764ba2;
            border-radius: 12px; text-align:center; }
        .gallery-image { width: 300px; margin: 10px; border-radius: 8px;
            opacity:0; transition:0.5s; }
        .gallery-image.visible { opacity:1; }
        </style>
    `);

    let count = 0;

    imagesUrl.forEach((url, i) => {
        setTimeout(() => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "gallery-image";
            imagesContainer.appendChild(img);

            setTimeout(() => img.classList.add("visible"), 100);

            count++;
            console.log(`Зображення додано: ${count}/${imagesUrl.length}`);
        }, i * 1000);
    });

    parentElement.appendChild(imagesContainer);
}

setTimeout(addImagesToPage, 5000);
console.log("⏳ Зачекайте 5 секунд...");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM повністю завантажено. Починаємо ініціалізацію...");

  // ---------- 1) Галерея з Art Institute of Chicago (search?q=cats) ----------
  const API_SEARCH = "https://api.artic.edu/api/v1/artworks/search?q=cats&fields=id,title,image_id&limit=20";

  async function fetchCatArtworks() {
    const parent = document.querySelector(".mal");
    if (!parent) {
      console.error(".mal елемент не знайдено на сторінці.");
      return;
    }

    // Показуємо лоадер/текст
    parent.innerHTML = `<div class="images-gallery"><h2>Завантаження галереї котів...</h2></div>`;
    const container = parent.querySelector(".images-gallery");

    try {
      console.log("Запит на API:", API_SEARCH);
      const resp = await fetch(API_SEARCH);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log("Відповідь API отримана", data);

      const artworks = (data.data || []).filter(a => a.image_id);
      if (artworks.length === 0) {
        container.innerHTML = "<h2>Картинки не знайдені</h2><p>Спробуйте пізніше.</p>";
        return;
      }

      // Додаємо стилі (щоб бачити картинки)
      const style = document.createElement("style");
      style.textContent = `
        .images-gallery { padding: 20px; background: linear-gradient(135deg,#667eea,#764ba2); border-radius:12px; color:#fff; text-align:center; }
        .images-grid { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:12px; }
        .images-grid img { width:220px; height:220px; object-fit:cover; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.35); }
        .art-card { max-width:220px; font-size:13px; color:#fff; }
        .art-title { margin-top:6px; text-align:left; color:#fff; padding:4px; }
      `;
      document.head.appendChild(style);

      // IIIF URL шаблон (Art Institute)
      // приклад: https://www.artic.edu/iiif/2/{image_id}/full/400,/0/default.jpg
      const grid = document.createElement("div");
      grid.className = "images-grid";

      artworks.forEach(item => {
        const img = document.createElement("img");
        const imageId = item.image_id;
        // вибираємо розмір 400 по найменшому боку
        img.src = `https://www.artic.edu/iiif/2/${imageId}/full/400,/0/default.jpg`;
        img.alt = item.title || "Artwork";
        img.loading = "lazy";

        // fallback якщо зображення не завантажилось
        img.onerror = () => {
          img.style.display = "none";
          console.warn("Помилка завантаження зображення:", img.src);
        };

        const card = document.createElement("figure");
        card.className = "art-card";
        card.appendChild(img);

        const caption = document.createElement("figcaption");
        caption.className = "art-title";
        caption.textContent = item.title || "Без назви";
        card.appendChild(caption);

        grid.appendChild(card);
      });

      container.innerHTML = "<h2>Галерея котів — Art Institute of Chicago</h2>";
      container.appendChild(grid);

      console.log(`Додано ${artworks.length} картинок до галереї.`);
    } catch (err) {
      console.error("Помилка при запиті до API або обробці:", err);
      parent.innerHTML = `<div class="images-gallery"><h2>Не вдалося завантажити галерею</h2><p>${err.message}</p></div>`;
    }
  }

  // Викликаємо функцію відразу після DOMContentLoaded
  fetchCatArtworks();

  // ---------- 2) Валідація login / email / phone (match/search/replace) ----------
  const checkAuthBtn = document.getElementById("checkAuth");
  if (checkAuthBtn) {
    checkAuthBtn.addEventListener("click", () => {
      const result = document.getElementById("authResult");
      result.textContent = "";

      let login = document.getElementById("login").value || "";
      let email = document.getElementById("email").value || "";
      let phone = document.getElementById("phone").value || "";

      // Очистка login від зайвих символів -> replace()
      login = login.replace(/[^a-zA-Z0-9_]/g, "");
      console.log("Очищений login:", login);

      // login: латиниця/цифри/_ довжина 3-16 -> match()
      if (!login.match(/^[a-zA-Z0-9_]{3,16}$/)) {
        result.textContent = "❌ Login має містити 3-16 символів (латиниця, цифри, _)";
        return;
      }

      // email: коротка перевірка через search() та pattern через test()
      if (email.search(/@/) === -1 || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
        result.textContent = "❌ Невірний email";
        return;
      }

      // phone: видаляємо неціфрові символи, перевіряємо формат 380XXXXXXXXX
      const digits = phone.replace(/\D/g, "");
      if (!digits.match(/^380\d{9}$/)) {
        result.textContent = "❌ Телефон має бути у форматі +380XXXXXXXXX або 380XXXXXXXXX";
        return;
      }

      result.textContent = "✅ Дані введено правильно!";
      console.log("Авторизація пройдена (login/email/phone OK).");
    });
  } else {
    console.warn("#checkAuth кнопка не знайдена на сторінці.");
  }

  // ---------- 3) Set для повторюваних слів ----------
  const usedWords = new Set();
  const checkBtn = document.getElementById("checkBtn");
  const wordInput = document.getElementById("wordInput");
  const message = document.getElementById("message");

  if (checkBtn && wordInput && message) {
    checkBtn.addEventListener("click", () => {
      const w = wordInput.value.trim().toLowerCase();
      if (!w) {
        message.textContent = "Введіть слово!";
        return;
      }
      if (usedWords.has(w)) {
        message.textContent = `⚠️ Слово "${w}" вже було введено`;
        console.log("Повторене слово:", w);
      } else {
        usedWords.add(w);
        message.textContent = `✅ Слово "${w}" додано`;
        console.log("Додано слово:", w);
      }
      wordInput.value = "";
    });
  } else {
    console.warn("Елементи для перевірки слів (checkBtn/wordInput/message) не знайдені.");
  }

  console.log("Ініціалізація скрипта завершена.");
});
