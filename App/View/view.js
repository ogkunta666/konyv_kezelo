var books = [];
var nextId = 1;
// Könyv hozzáadása
function addBook(event) {
    event.preventDefault();
    var titleInput = document.getElementById("title");
    var authorInput = document.getElementById("author");
    var yearInput = document.getElementById("year");
    var isbnInput = document.getElementById("isbn");
    var newBook = {
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
function deleteBook(id) {
    books = books.filter(function (book) { return book.id !== id; });
    renderBooks();
}
// Könyvek megjelenítése
function renderBooks() {
    var tbody = document.getElementById("book-table-body");
    tbody.innerHTML = "";
    for (var _i = 0, books_1 = books; _i < books_1.length; _i++) {
        var book = books_1[_i];
        var row = document.createElement("tr");
        row.innerHTML = "\n      <td>".concat(book.id, "</td>\n      <td>").concat(book.title, "</td>\n      <td>").concat(book.author, "</td>\n      <td>").concat(book.year, "</td>\n      <td>").concat(book.isbn, "</td>\n      <td><button class=\"delete\" onclick=\"deleteBook(").concat(book.id, ")\">T\u00F6rl\u00E9s</button></td>\n    ");
        tbody.appendChild(row);
    }
}
// Amikor betölt az oldal
window.onload = function () {
    var form = document.getElementById("book-form");
    form.addEventListener("submit", addBook);
    renderBooks();
};
