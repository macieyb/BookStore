$(function () {

    loadAllAuthors();

    var authorAddForm = $("form#authorAdd");
    authorAddForm.on("submit", authorAddFormSubmit);


    var authorList = $("ul#authorsList");
    authorList.on("click", ".btn-author-remove", deleteAuthor);

    var authorEditSelect = $("select#authorEditSelect");
    authorEditSelect.on("change", authorEditSelectChange);

    var form = $("form#authorEdit");
    form.on("submit", authorEditSubmit);


    // 1. Dodawanie nowego autora --------------------------

    function authorAddFormSubmit(event){
        var inputName = $("form#authorAdd").find("input#name");
        var name = inputName.val();
        var inputSurname = $("form#authorAdd").find("input#surname");
        var surname = inputSurname.val();

        if(name && surname){

            $.ajax({
                url: "../rest/rest.php/author",
                method: "POST",
                data: {
                    name: name,
                    surname: surname
                },
                dataType: "json"
            }).done(function (result) {
                console.log(result);
                addAuthorsToDom((result["success"]));
                addToAuthorEditSelect((result["success"]));
                inputName.val("");
                inputSurname.val("");
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
        return false;
    }


    // 2. Wyświetlanie elementów w DOM -----------------------------

    function loadAllAuthors (){

        $.ajax({
            url: "../rest/rest.php/author",
            method: "GET",
            data: {},
            dataType: "json"
        }).done(function (result) {
            var authors = result["success"];
            if (authors.length > 0) {
                addAuthorsToDom(authors);
                addToAuthorEditSelect(authors);
            }
        }).fail(function (xhr, status, err) {
            console.log(status, err);
        });
    }


    function addAuthorsToDom(authors) {
        var list = $("ul#authorsList");

        for (var i = 0; i < authors.length; i++) {
            var inner = "<div class='panel panel-default'>"+
                "<div class='panel-heading'><span class='authorTitle'>"+authors[i].name+" "+authors[i].surname+"</span>"+
                "<button data-id='"+authors[i].id+"' class='btn btn-danger pull-right btn-xs btn-author-remove'><i class='fa fa-trash'></i></button>"+
                "</div>"+
                "</div>";
            var li = $("<li class='list-group-item'>");

            li.html(inner);
            list.append(li);
        }
    }


    // 3. Usuwanie autora --------------------------------


    function deleteAuthor(event) {
        var id = $(this).data("id");
        var toDelete = $(this).closest("li");
        var toDeleteOption = $("select#authorEditSelect")
            .find("OPTION[value=" + id + "]");

        $.ajax({
            url: "../rest/rest.php/author/" + id,
            method: "DELETE",
            data: {},
            dataType: "json"
        }).done(function (result) {
            console.log(result);
            var isDeleted = result["success"] === "deleted";
            if (isDeleted) {
                toDelete.remove();
                toDeleteOption.remove();
                $("select#authorEditSelect").val("");
                form.slideUp();
            }
        }).fail(function (xhr, status, err) {
            console.log(status, err);
        });
    }


    // 4. Modyfikowanie autora ---------------------------

    // 4.1 dodanie autora do selecta ---------------------

    function addToAuthorEditSelect(authors) {
        var authorEditSelect = $("SELECT#authorEditSelect");

        for (var i = 0; i < authors.length; i++) {
            var option = $("<OPTION value='" + authors[i].id + "'>");
            option.html(authors[i].name + " " + authors[i].surname);
            authorEditSelect.append(option);
        }
    }


    // 4.2 edycja autora ---------------------------------


    function authorEditSelectChange(event) {
        var form = $("form#authorEdit");
        var id = $(this).val();
        if (id === "") {
            form.slideUp();
        } else {

            $.ajax({
                url: "../rest/rest.php/author/" + id,
                method: "GET",
                data: {},
                dataType: "json"
            }).done(function (result) {
                var authors = result["success"];
                if (authors.length > 0) {
                    form.find("#id").val(authors[0].id);
                    form.find("#name").val(authors[0].name);
                    form.find("#surname").val(authors[0].surname);
                    form.slideDown();
                }
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
    }

    // 4.3 zapisanie zmian ---------------------------------


    function authorEditSubmit(event) {
        var form = $("form#authorEdit");
        var id = form.find("input#id").val();
        var name = form.find("input#name").val();
        var surname = form.find("input#surname").val();

        if (name && surname) {
            $.ajax({
                url: "../rest/rest.php/author/" + id,
                method: "PATCH",
                data: {
                    name: name,
                    surname: surname
                },
                dataType: "json"
            }).done(function (result) {
                updateDom(result["success"]);
                $("select#authorEditSelect").val("");
                form.slideUp();
            }).fail(function (xhr, status, err) {
                console.log(status, err);
            });
        }
        return false;
    }


    function updateDom(author) {
        updateAuthorList(author);
        updateSelectEdit(author);
    }

    function updateAuthorList(author) {
        $("ul#authorsList").find("button[data-id=" + author[0].id + "]")
            .first().siblings("span.authorTitle").html(author[0].name + " " + author[0].surname);
    }

    function updateSelectEdit(author) {
        $("select#authorEditSelect").find("option[value=" + author[0].id + "]")
            .html(author[0].name + " " + author[0].surname);
    }




});