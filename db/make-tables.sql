CREATE DATABASE todo_list_db;
USE todo_list_db;

CREATE TABLE ToDoList (
    listID INT NOT NULL AUTO_INCREMENT UNIQUE,
    listName TEXT NOT NULL,
    CONSTRAINT ToDoListPK PRIMARY KEY (listID)
);

CREATE TABLE ToDoEntry (
    listID INT NOT NULL,
    entryID INT NOT NULL,
    checked BIT(1),
    description TEXT NOT NULL,
    CONSTRAINT ToDoEntryPK PRIMARY KEY (listID, entryID),
    CONSTRAINT ToDoEntryListFK FOREIGN KEY(listID) 
        REFERENCES ToDoList(listID)
);

CREATE TABLE EntryChildren (
    listID INT NOT NULL,
    parentID INT NOT NULL,
    childID INT NOT NULL,
    CONSTRAINT EntryChildrenEntryPK PRIMARY KEY (listID, parentID, childID),
    CONSTRAINT EntryChildrenListFK FOREIGN KEY(listID) 
        REFERENCES ToDoList(listID),
    CONSTRAINT EntryChildrenParentFK FOREIGN KEY(listID, parentID) 
        REFERENCES ToDoEntry(listID, entryID),
    CONSTRAINT EntryChildrenChildFK FOREIGN KEY(listID, childID) 
        REFERENCES ToDoEntry(listID, entryID)
);
