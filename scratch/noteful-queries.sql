-- Select all notes

SELECT * FROM notes;

-- Select notes limit by 5

SELECT * FROM notes LIMIT 5;

-- Select all notes ordered by title

SELECT * FROM notes ORDER BY title ASC;

-- Select notes where title is a string (exact)

SELECT * FROM notes WHERE title = '5 life lessons learned from cats';

-- Select notes where title is like a string

SELECT * FROM notes WHERE title LIKE '10%';

-- Update title of a note

UPDATE notes SET title = 'Rabbits are better than cats', content = 'We know it''s true' WHERE id = 1002;

-- Delete a note by id

DELETE FROM notes WHERE id = 1002;

-- Insert a note without fields

INSERT INTO notes (content) VALUES ('This is a test');
