$(function (e) {

    loadAllBooks();
    // Zadanie 1 - dodawanie nowej książki --------------------------

    var bookAddForm = $("form#bookAdd");
    bookAddForm.on("submit", bookAddFormSubmit);

    var bookList = $("ul#booksList");
    bookList.on("click", ".btn-book-show-description", showDescription);
    bookList.on("click", ".btn-book-remove", deleteBook);

    var bookEditSelect = $("select#bookEditSelect");
    bookEditSelect.on("change", bookEditSelectChange);

    var form = $("form#bookEdit");
    form.on("submit", bookEditSubmit);


    function bookAddFormSubmit(event) {
        var inputTitle = $("form#bookAdd").find("input#title");
        var title = inputTitle.val();
        var inputDescription = $("form#bookAdd").find("textarea#description");
        var description = inputDescription.val();

        if (title && description) {
            $.ajax({
                url: "../rest/rest.php/book",
                method: "POST",
                data: {
                    title: title,
                    description: description
                },
                dataType: "json"
            }).done(function (result) {
                addBooksToDom((result["success"]));
                addToBookEditSelect((result["success"]));
                inputTitle.val("");
                inputDescription.val("");
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
        return false;
    }

    // Zadanie 2 - wyświetlanie wszystkich książek w DOM --------------------------


    function loadAllBooks() {

        $.ajax({
            url: "../rest/rest.php/book",
            method: "GET",
            data: {},
            dataType: "json"
        }).done(function (result) {
            var books = result["success"];
            if (books.length > 0) {
                addBooksToDom(books);
                addToBookEditSelect(books); // dodawanie ksiązek do selecta
            }
        }).fail(function (xhr, status, err) {
            console.log(status, err);
        });
    }

    function addBooksToDom(books) {
        var list = $("ul#booksList");

        for (var i = 0; i < books.length; i++) {
            var inner = "<div class='panel panel-default'>" +
                "<div class='panel-heading'>" +
                "<span class='bookTitle'>" + books[i].title + "</span>" +
                "<button data-id='" + books[i].id + "' class='btn btn-danger pull-right btn-xs btn-book-remove'><i class='fa fa-trash'></i></button>" +
                "<button data-id='" + books[i].id + "' class='btn btn-primary pull-right btn-xs btn-book-show-description'><i class='fa fa-info-circle'></i></button>" +
                "</div>" +
                "<div class='panel-body book-description'></div>" +
                "</div>";
            var li = $("<li class='list-group-item'>");

            li.html(inner);
            list.append(li);
        }
    }


    // Zadanie 3 - wyświetlanie opisu książki w DOM ---------------------------

    function showDescription(event) {
        var parent = $(this).closest("DIV");
        var panel = parent.next(".book-description");

        if (panel.html() === "") {
            var id = $(this).data("id");
            loadDescription(id, panel);
        } else {
            panel.slideToggle();
        }
    }

    function loadDescription(id, panel) {
        $.ajax({
            url: "../rest/rest.php/book/" + id,
            method: "GET",
            data: {},
            dataType: "json"
        }).done(function (result) {
            var books = result["success"];
            if (books.length > 0) {
                panel.html(books[0].description);
                panel.slideDown();
            }
        }).fail(function (xhr, status, err) {
            console.log(status, err);
        });
    }


    // Zadanie 4 - Usuwanie książki ----------------------------------------

    function deleteBook(event) {
        var id = $(this).data("id");
        var toDelete = $(this).closest("LI");
        var toDeleteOption = $("SELECT#bookEditSelect")
            .find("OPTION[value=" + id + "]");

        $.ajax({
            url: "../rest/rest.php/book/" + id,
            method: "DELETE",
            data: {},
            dataType: "json"
        }).done(function (result) {
            console.log(result);
            var isDeleted = result["success"] === "deleted";
            if (isDeleted) {
                toDelete.remove();
                toDeleteOption.remove();
            }
        }).fail(function (xhr, status, err) {
            console.log(status, err);
        });
    }

    // Zadanie 5 - modyfikacja książki ---------------------------------------------

    // etap 1 - dodadanie ksiązek do selecta

    function addToBookEditSelect(books) {
        var bookEditSelect = $("SELECT#bookEditSelect");

        for (var i = 0; i < books.length; i++) {
            var option = $("<OPTION value='" + books[i].id + "'>");
            option.html(books[i].title);
            bookEditSelect.append(option);
        }
    }


    // etap 2 - edytowanie książki

    function bookEditSelectChange(event) {
        var form = $("form#bookEdit");
        var id = $(this).val();
        if (id === "") {
            form.slideUp();
        } else {

            $.ajax({
                url: "../rest/rest.php/book/" + id,
                method: "GET",
                data: {},
                dataType: "json"
            }).done(function (result) {
                var books = result["success"];
                if (books.length > 0) {
                    form.find("#id").val(books[0].id);
                    form.find("#title").val(books[0].title);
                    form.find("#description").val(books[0].description);
                    form.slideDown();
                }
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
    }

    // etap 3 - zapisanie zmian

    function bookEditSubmit(event) {
        var form = $("form#bookEdit");
        var id = form.find("input#id").val();
        var title = form.find("input#title").val();
        var description = form.find("textarea#description").val();

        if (title && description) {
            $.ajax({
                url: "../rest/rest.php/book/" + id,
                method: "PATCH",
                data: {
                    title: title,
                    description: description
                },
                dataType: "json"
            }).done(function (result) {
                updateDom(result["success"]);
                $("select#bookEditSelect").val("");
                form.slideUp();
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
        return false;
    }


    function updateDom(book) {
        updateBookList(book);
        updateSelectEdit(book);
    }

    function updateBookList(book) {
        $("ul#booksList").find("button[data-id=" + book[0].id + "]")
            .first().siblings("span.bookTitle").html(book[0].title);
        $("ul#booksList").find("button[data-id=" + book[0].id + "]")
            .first().closest("DIV").next(".book-description").html(book[0].description);
    }

    function updateSelectEdit(book) {
        $("select#bookEditSelect").find("option[value=" + book[0].id + "]")
            .html(book[0].title);
    }

// dodać znikanie edycji jak usunę edytowaną książkę.

});