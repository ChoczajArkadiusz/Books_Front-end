$(function () {
    const booksListContainer = $(".books-list ul");
    const formBook = $("form");


    // Pobranie listy książek
    function getBooksList() {
        ajaxRequest("GET", "").done(function (resp) {
            printBooks(resp);
        });
    }

    getBooksList();


    // Rozwijane pole z wszystkimi informacjami o książce
    booksListContainer.on("click", "h3", function () {
        let div = $(this).next();
        let id = $(this).parent().data("id");
        let ajaxType = $(this).parent().data("ajax");

        if (div.is(":hidden")) {
            ajaxRequest(ajaxType, id).done(function (resp) {
                div.text(null);
                [...Object.entries(resp)].forEach(function (entry) {
                    div.append("&emsp;");
                    div.append(entry[0] + " - " + entry[1]);
                    div.append($("<br>"));
                })
            });
        }
        div.slideToggle();
    });


    function createRow(book) {
        let li = $(`<li class="book-title"></li>`).data("id", book.id).data("ajax", "GET");
        li.append($("<h3>").text(book.title));
        li.append($("<div></div>").hide());
        li.append($("<div></div>")
            .append($(`<a href="#" class="edit-book" data-ajax="PUT"> Edytuj pozycję</a>`))
            .append("&emsp;&emsp;&emsp;")
            .append($(`<a href="#" class="delete-book" data-ajax="DELETE"> Usuń pozycję z bazy danych </a>`)));
        li.append($("<div class='edit-form'></div>").hide());
        return li;
    }

    function printBooks(resp) {
        booksListContainer.text(null);
        resp.forEach(function (book) {
            booksListContainer.append(createRow(book));
        });
    }


    // Dodawanie/edycja książki
    formBook.on("submit", function (event) {
        event.preventDefault();
        let ajaxType = $(this).data("ajax");
        let id = $(this).parent().parent().data("id");

        let newBook = new Book(
            $(this).find(".author").val(),
            $(this).find(".title").val(),
            $(this).find(".isbn").val(),
            $(this).find(".type").val(),
            $(this).find(".publisher").val(),
        );
        if (id === null || id === undefined) {
            id = "";
        } else {
            newBook.setId(id);
        }

        addBook(ajaxType, id, newBook);
    });

    function addBook(ajaxType, id, newBook) {
        ajaxRequest(ajaxType, id, newBook).done(function (resp) {
            getBooksList();
        });
    }

    function Book(author, title, isbn, type, publisher) {
        this.id = Math.floor(Math.random() * 1000000);
        this.author = author;
        this.title = title;
        this.isbn = isbn;
        this.type = type;
        this.publisher = publisher;
    }
    Book.prototype.setId = function (id) {
        this.id = id;
    };


    // Edycja książki
    booksListContainer.on("click", ".edit-book", function (event) {
        event.preventDefault();
        let div = $(this).parent().next();

        if (div.is(":hidden")) {
            let id = $(this).parent().parent().data("id");
            let ajaxType = $(this).parent().parent().data("ajax");
            div.text(null);
            div.append($("<br><br><h4> Edycja wpisu: </h4><br>"));
            let editForm = formBook.clone(true);
            ajaxRequest(ajaxType, id).done(function (resp) {
                editForm.find(".author").val(resp.author);
                editForm.find(".title").val(resp.title);
                editForm.find(".isbn").val(resp.isbn);
                editForm.find(".type").val(resp.type);
                editForm.find(".publisher").val(resp.publisher);
            });
            editForm.data("ajax", "PUT");
            editForm.attr("data-ajax", "PUT");
            div.append(editForm);
        }
        div.slideToggle();
    });


    // Usuwanie książki
    booksListContainer.on("click", ".delete-book", function (event) {
        event.preventDefault();
        let id = $(this).parent().parent().data("id");
        let ajaxType = $(this).data("ajax");

        ajaxRequest(ajaxType, id).done(function (resp) {
            getBooksList();
        });
    });


    // AJAX
    function ajaxRequest(type, id, book) {
        return $.ajax({
            url: "http://localhost:8282/books/" + id,
            type: type,
            data: JSON.stringify(book),
            contentType: "application/json"
        }).fail(function (error) {
            console.log(error);
        });
    }


});
