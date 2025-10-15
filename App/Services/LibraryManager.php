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
   
}

