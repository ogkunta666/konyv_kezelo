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
