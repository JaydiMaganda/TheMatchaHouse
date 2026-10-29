const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");
        const span = document.createElement("span");

        span.textContent = task.text;
        span.className = "task-text";

        if (task.completed) {
            span.classList.add("completed");
        }

        span.onclick = function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            showTasks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.onclick = function() {
            tasks.splice(index, 1);
            saveTasks();
            showTasks();
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    showTasks();
}

addTaskBtn.onclick = addTask;

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

showTasks();


/* The Matcha House - Smart Drink Search */
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("menuSearch");
    const productGrid = document.getElementById("productGrid");
    const noResults = document.getElementById("noResults");

    if (!searchInput || !productGrid) {
        console.error("Search input or product grid was not found.");
        return;
    }

    const originalCards = Array.from(
        productGrid.querySelectorAll(".product-card")
    );

    // Make searches easier: ignore capitalization and extra spaces.
    function normalize(text) {
        return text.toLowerCase().trim().replace(/\s+/g, " ");
    }

    searchInput.addEventListener("input", function () {
        const query = normalize(searchInput.value);

        // Restore the original menu when the search is empty.
        if (query === "") {
            originalCards.forEach(function (card) {
                card.style.display = "";
                productGrid.appendChild(card);
            });

            if (noResults) noResults.hidden = true;
            return;
        }

        const results = originalCards.map(function (card, index) {
            const name = normalize(
                card.dataset.name ||
                card.querySelector("h3")?.textContent ||
                ""
            );

            const description = normalize(
                card.querySelector(".product-info p")?.textContent || ""
            );

            let score = 0;

            if (name === query) {
                score = 100; // Exact drink name
            } else if (name.startsWith(query)) {
                score = 80; // Drink name starts with search
            } else if (name.includes(query)) {
                score = 60; // Search appears in drink name
            } else if (description.includes(query)) {
                score = 20; // Search appears in description
            }

            return { card, score, index };
        });

        const matches = results
            .filter(function (item) {
                return item.score > 0;
            })
            .sort(function (a, b) {
                return b.score - a.score || a.index - b.index;
            });

        const matchedCards = new Set(
            matches.map(function (item) {
                return item.card;
            })
        );

        // Show the best matches first.
        matches.forEach(function (item) {
            item.card.style.display = "";
            productGrid.appendChild(item.card);
        });

        // Hide drinks that don't match.
        originalCards.forEach(function (card) {
            if (!matchedCards.has(card)) {
                card.style.display = "none";
                productGrid.appendChild(card);
            }
        });

        if (noResults) {
            noResults.hidden = matches.length > 0;
        }
    });
});

