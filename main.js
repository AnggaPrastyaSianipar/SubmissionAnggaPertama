const bookForm = document.getElementById("bookForm");
const searchBookForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
let books = JSON.parse(localStorage.getItem("books")) || []; 

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks(booksToRender = books) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  booksToRender.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    
    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.textContent = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.onclick = () => {
      book.isComplete = !book.isComplete; 
      saveBooks(); 
      renderBooks(); 
    };

    
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.onclick = () => {
      books = books.filter(b => b.id !== book.id); 
      saveBooks(); 
      renderBooks(); 
    };

    
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.onclick = () => {
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;
      bookForm.dataset.editingId = book.id; 
      document.getElementById("bookFormSubmit").textContent = "Update Buku"; 
    };

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(buttonContainer);

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const editingId = bookForm.dataset.editingId;
  if (editingId) {
    const bookIndex = books.findIndex(book => book.id === editingId);
    if (bookIndex !== -1) {
      books[bookIndex] = { id: editingId, title, author, year, isComplete };
      delete bookForm.dataset.editingId; 
      document.getElementById("bookFormSubmit").textContent = "Masukkan Buku ke rak"; 
    }
  } else {
    books.push({ id: Date.now().toString(), title, author, year, isComplete }); 
  }

  bookForm.reset();
  saveBooks(); 
  renderBooks();
});

searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const searchTerm = document.getElementById("searchBookTitle").value.toLowerCase();

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
  renderBooks(filteredBooks);
});

document.addEventListener("DOMContentLoaded", () => {
  renderBooks(); 
});

// Menampilkan pesan awal
console.log('Hello, world!');