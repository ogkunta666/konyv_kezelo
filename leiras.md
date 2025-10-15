# Konyv Kezelo CRUD alapu PHP alkalmazas


# A dokumentaciorol

    3 ember irta : Mate Balint Akos, Kiss Zoltan Mate, Marki Zoltan Akos - Az ekezet nelkuli reszeket Marki Zoltan irta hiszen angol kiosztasu 60%-os billentyum van ezert lehetetlen ekezetet irjak.



# Model - Kiss Zoltán Máté


    A model egy konstruktort illetve publikus mezőket tartalmaz pontosabban :
    
        1. id
        2. title - a könyv címe
        3. author - a könyv szerzője
        4. year - a könyv kiadási éve
        5. isbn - a könyv isbn értékelése 

    A __construct függvény pedig ezek alapján az éppen átmenő adatbázis elem szerint épíiti össze a könyvet.



# Controller - Marki Zoltan Akos


    A controller vagyis a LibraryManager a kod agyat tartalmazza az CR(U)D muveletekkel (az update hianyzik), itt is talalhato egy construct ami a pdo kapcsolatot epiti fel.

```php

   public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
```

    Ezt kovetoen pedig a C(reate) vagyis a konyv hozzaadasa kovetkezik ami atveszi a cimet a irot a kiadasi evet es az isbnt majd ezt hozzaadja az adatbazishoz mySQL paranccsal sql injection elleni vedelemmel.

```php
    public function addBook($title, $author, $year, $isbn)
        {
            $stmt = $this->pdo->prepare("INSERT INTO books (title, author, year, isbn) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $author, $year, $isbn]);
        }
```


    Ez utan jon a getBooks ami ID szerint csokkeno sorrendbe kiirja a konyveket es amig van mit kiirni addig hozza is adja a viewhoz.

```php
    public function getBooks()
    {
        $stmt = $this->pdo->query("SELECT * FROM books ORDER BY id DESC");
        $books = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $books[] = new Book($row['id'], $row['title'], $row['author'], $row['year'], $row['isbn']);
        }

        return $books;
    }
```

    Most kovetkezik a "veszely" zona ahol egy nem megfelelo kattintas es torlod az egesz adatbazist. deleteBook - egy adott konyvet torol csak ID alapjan mySQL paranccsal.

```php
 public function deleteBook($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);
    }
```

    A clearBooks pedig az egesz adatbazist torli.

```php
  public function clearBooks()
    {
        $this->pdo->exec("TRUNCATE TABLE books");
    }
```



# View - Máté Bálint Ákos
    A view részben történt egy html, css, és egy typescript kód megírása amit végül átalakitottam js-é hogy lefussom normálisan.

### a htmlel kezdek:
    
```html
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="view.css">
      <title>Könyvkatalógus</title>
    </head>
```
    !-el és tab megnyomásával létrehoztam az alapot, majd hozzáadtam a css-t és adtam neki egy címet


```html
<body>
  <h1>Könyvkatalógus</h1>

  <form id="book-form">
    <input type="text" id="title" placeholder="Cím" required>
    <input type="text" id="author" placeholder="Szerző" required>
    <input type="number" id="year" placeholder="Év" required>
    <input type="text" id="isbn" placeholder="ISBN" required>
    <button type="submit">Hozzáadás</button>
  </form>
```

    itt létrehoztam egy formot, mindegyik mezőnek adtam egy id-t amit később felhasználtam a typescriptbe, egy placeholdert, és egy required tulajdonságot amit azt csinálja hogy a mezőt kötelező kitölteni.


```html
<table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Cím</th>
        <th>Szerző</th>
        <th>Év</th>
        <th>ISBN</th>
        <th>Művelet</th>
      </tr>
    </thead>
    <tbody id="book-table-body">
      <!-- JS tölti be -->
    </tbody>
  </table>
```

    itt létrehoztam egy táblát, ahol a thead a fejlécet jelöli ami érthetőbbé teszi a felhasználónak a dolgokat, a tbody-ba pedig minden egyes hozzáadott könyvet fogjuk tudni majd beágyazni a typescriptbe.



```html
<script src="view.js"></script>
```

    hozzáadtam a view.js-t, nem a ts-t mivel átkell alakítani a typescript kódot javascript kóddá a tsc view.ts parancsal a cmd-be.

### css:

```css
body {
  font-family: Arial, sans-serif;
  background-color: #fafafa;
  margin: 40px;
}
```
    világosszürke háttérszínt adtam az oldalnak, és 40px margót raktam az oldak szélei körül

```css
h1 {
  text-align: center;
}
```
    a főcímet középre igazítottam

```css
form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
```
    10px tavolsag lesz az űrlap elemei között, 20px tavolsag lesz az űrlap alja utan

```css
input, button {
  padding: 8px;
  font-size: 14px;
}
```
    hogy ne legyen mar tul szűk 8px belso margot adtam hozzá, és egy 14pxes betumeretet 

```css
table {
  width: 100%;
  border-collapse: collapse;
}
```
    a tablazat foglalja el az egesz oldalt, es nem lesz res a cellak kozott

```css
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
```
    adtam egy kicsi keretet minden cellahoz, cellak tartalma balra van igazitva, es egy 8pxes margo

```css
button.delete {
  background-color: #ff4c4c;
  color: white;
  border: none;
  cursor: pointer;
}
```
    a delete gombnak adtam egy piros hattert, feher szovegszin, es egerkurzor amint rajtavagyunk hogy jelezzem hogy kattinthato

### ts:

```ts
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  isbn: string;
}
```

    itt definialtam a Book interfészt.

```ts
let books: Book[] = [];
let nextId = 1;
```
    books: üres tomb amibe csak Book tipusu adatok tehetoek
    nextId: kovetkezo konyvhoz kapcsolodo Id, minden uj konyv hozzaadasanal 1el no majd

```ts
function addBook(event: Event): void {

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
```

    lekerem az input mezoket, es tipusbiztosan HTMLInputElementkent kezeli oket
    uj konyv letrehozasa (newBook) a megadott adatokkal, az evszamot szovegbol atalakitom szamma.
    pushal hozzáadom a könyvet a books tömbhöz
    renderbooksal pedig majd frissitem a tablazatot az uj konyvel
    majd az urlap mezoit kiuritem

```ts
// Könyv törlése
function deleteBook(id: number): void {
  books = books.filter(book => book.id !== id);
  renderBooks();
}
```
    a .filter() egy tombmetodus, amely egy uj tombot ad vissza csak azokat az elemeket megtartva amik megfelelnek az adott feltetelnek, ezaltal kilehet torolni azt az id-ű konyvet amire rakattintottunk
    majd ujratoltjuk az oldalt ahol mar kivan torolve a könyv.

```ts
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
```

    lekerem a tablazat tbody elemet ahol a konyvek megjelennek
    kiuritem a tablazatot 
    vegigmegyek a konyveken es minden egyes konyvhoz egy uj sort kapcsolok 
    majd a vegen hozzaadom a sort a tablazathoz

```ts
window.onload = () => {
  const form = document.getElementById("book-form") as HTMLFormElement;
  form.addEventListener("submit", addBook);
  renderBooks();
};
```

    bevallom chatgpt, mert mar kicsit meg gyult a bajom ezzel, es a filterrel is de ha jol ertelmezem akkor:
    a form lekéri az űrlapot,
    a form.addeventlistener az űrlap beküldéséhez hozzaadja az addbook fuggvenyt esemenykezelokent
    majd inicializalja a renderbooksot bar ures mivel most books tömb kezdetben ures.

