<?php
namespace App\Models;

class Book
{
    public $id;
    public $title;
    public $author;
    public $year;
    public $isbn;

    public function __construct($id, $title, $author, $year, $isbn)
    {
        $this->id = $id;
        $this->title = $title;
        $this->author = $author;
        $this->year = $year;
        $this->isbn = $isbn;
    }
}
