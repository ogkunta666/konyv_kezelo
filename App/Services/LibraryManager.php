<?php
namespace App\Services;

use App\Models\Book;
use PDO;

class LibraryManager
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

     public function addBook($title, $author, $year, $isbn)
    {
        $stmt = $this->pdo->prepare("INSERT INTO books (title, author, year, isbn) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $author, $year, $isbn]);
    }

        public function getBooks()
    {
        $stmt = $this->pdo->query("SELECT * FROM books ORDER BY id DESC");
        $books = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $books[] = new Book($row['id'], $row['title'], $row['author'], $row['year'], $row['isbn']);
        }

        return $books;
    }

      public function deleteBook($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);
    }

      public function clearBooks()
    {
        $this->pdo->exec("TRUNCATE TABLE books");
    }

}




