<?php

/**
 * Class Book
 */
class Book implements JsonSerializable
{
    private $id, $title, $description;

    public static $db;

    public function __construct(PDO $db)
    {
        self::$db = $db;

        $this->id = -1;
        $this->title = '';
        $this->description = '';
    }

    public function save()
    {
        if ($this->id > 0) {
            //update
            $sql = "UPDATE books SET title=:title, description=:description WHERE id=:id";
            $stmt = self::$db->prepare($sql);
            $stmt->execute(
                [
                    'id'          => $this->id,
                    'title'       => $this->title,
                    'description' => $this->description,
                ]
            );

            return $this;
        } else {
            //insert
            $sql = "INSERT INTO books SET title=:title, description=:description";
            $stmt = self::$db->prepare($sql);
            $stmt->execute(
                [
                    'title'       => $this->title,
                    'description' => $this->description,
                ]
            );

            $this->id = self::$db->lastInsertId();

            return $this;
        }
    }

    public function delete()
    {
        $sql = "DELETE FROM books WHERE id=:id";
        $stmt = self::$db->prepare($sql);
        $stmt->execute(
            [
                'id' => $this->id,
            ]
        );

        return $stmt->rowCount() > 0;
    }

    /**
     * Load all books or one book if id provided
     *
     * @param PDO $db
     * @param null $id
     *
     * @return array
     */
    public static function loadAll(PDO $db, $id = null)
    {
        $params = [];
        if (!$id) {
            $sql = "SELECT * FROM books";
        } else {
            $sql = "SELECT * FROM books WHERE id=:id";
            $params = ['id' => $id];
        }
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        $books = $stmt->fetchAll(PDO::FETCH_OBJ);
        $booksList = [];

        foreach ($books as $dbBook) {
            $book = new Book($db);
            $book->id = $dbBook->id;
            $book->title = $dbBook->title;
            $book->description = $dbBook->description;

            $booksList[] = $book;
        }

        return $booksList;
    }

    public function jsonSerialize()
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
        ];
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     *
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }
}