USE todo_list_db;

INSERT INTO ToDoList VALUES
    (100, "user 0 first list"),
    (101, "user 1 first list"),
    (102, "user 0 second list"),
    (103, "user 1 second list"),
    (104, "user 1 third list");

INSERT INTO ToDoEntry VALUES
    (100, 0, true, "I am user 0, this is my first list. This is my first entry, and should be checked."),
    (100, 1, false, "I am user 0, this is my first list. This is my second entry, and should NOT be checked."),
    (100, 2, false, "I am user 0, this is my first list. This is my third entry. bingus"),

    (101, 0, false, "I am user 1, this is my first list. This is my first entry, and should NOT be checked."),
    (101, 1, true, "I am user 1, this is my first list. This is my second entry, and should be checked."),
    (101, 2, false, "I am user 1, this is my first list. This is my third entry. bingus"),

    (102, 0, true, "I am user 0, this is my 2nd list. This is my first entry, and should be checked."),
    (102, 1, false, "I am user 0, this is my 2nd list. This is my second entry, and should NOT be checked."),
    (102, 2, false, "I am user 0, this is my 2nd list. This is my third entry. bingus"),

    (103, 0, false, "I am user 1, this is my 2nd list. This is my first entry, and should NOT be checked."),
    (103, 1, true, "I am user 1, this is my 2nd list. This is my second entry, and should be checked."),
    (103, 2, false, "I am user 1, this is my 2nd list. This is my third entry. bingus"),

    (104, 0, false, "größter Kartoffelsaft"),
    (104, 1, true, "π ≈ 3.1415926535..."),
    (104, 2, true, "全球最大的土豆汁"),
    (104, 3, true, "SELECT * FROM Users");

INSERT INTO EntryChildren VALUES
    (100, 0, 1),
    (100, 0, 2),

    (101, 1, 2),

    (104, 0, 1),
    (104, 1, 2),
    (104, 2, 3);
