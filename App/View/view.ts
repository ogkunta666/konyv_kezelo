interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  isbn: string;
}

let books: Book[] = [];
let nextId = 1;

// Könyv hozzáadása
function addBook(event: Event): void {
  event.preventDefault();

  const titleInput = document.getElementById("title") as HTMLInputElement;
  const authorInput = document.getElementById("author") as HTMLInputElement;
  const yearInput = document.getElementById("year") as HTMLInputElement;
  const isbnInput = document.getElementById("isbn") as HTMLInputElement;

  const newBook: Book = {
    id: nextId++,
    title: titleInput.value,
    author: authorInput.value,
    year: Number(yearInput.value),
    isbn: isbnInput.value
  };

  books.push(newBook);
  renderBooks();

  // mezők ürítése
  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isbnInput.value = "";
}

// Könyv törlése
function deleteBook(id: number): void {
  books = books.filter(book => book.id !== id);
  renderBooks();
}

// Könyvek megjelenítése
function renderBooks(): void {
  const tbody = document.getElementById("book-table-body") as HTMLElement;
  tbody.innerHTML = "";

  for (const book of books) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td>${book.isbn}</td>
      <td><button class="delete" onclick="deleteBook(${book.id})">Törlés</button></td>
    `;
    tbody.appendChild(row);
  }
}

// Amikor betölt az oldal
window.onload = () => {
  const form = document.getElementById("book-form") as HTMLFormElement;
  form.addEventListener("submit", addBook);
  renderBooks();
};
