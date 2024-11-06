CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('Javier Coronado', 'https://example.com', 'Stoic Mentality');
insert into blogs (author, url, title, likes) values ('Robert Fabbri', 'https://www.robertfabbri.com/', 'Emperor of Rome', 5);