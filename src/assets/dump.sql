CREATE TABLE IF NOT EXISTS tasktable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, 
    details TEXT
);

INSERT or IGNORE INTO tasktable(id, title, details) VALUES (1, 'Task 1', 'This is task 1');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (2, 'Task 2', 'This is task 2');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (3, 'Task 3', 'This is task 3');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (4, 'Task 4', 'This is task 4');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (5, 'Task 5', 'This is task 5');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (6, 'Task 6', 'This is task 6');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (7, 'Task 7', 'This is task 7');
INSERT or IGNORE INTO tasktable(id, title, details) VALUES (8, 'Task 8', 'This is task 8');
