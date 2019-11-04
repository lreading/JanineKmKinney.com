CREATE TABLE Users
(
    Id SERIAL PRIMARY KEY,
    Usersname VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(128) NOT NULL,
    Salt VARCHAR(128) NOT NULL,
    LastLogin TIMESTAMP NOT NULL,
    FailedAttempts INT NOT NULL,
    LastFailedAttempt TIMESTAMP NULL
);
CREATE INDEX users_name_idx ON Users(Usersname);

CREATE TABLE Page
(
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    CreateByUsersId INT NOT NULL,
    CreatedAt TIMESTAMP NOT NULL,
    UpdatedAt TIMESTAMP NULL
);
CREATE INDEX page_name_idx ON Page(Name);

CREATE TABLE Page_Section
(
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    CreatedAt TIMESTAMP NOT NULL,
    CreatedByUsersId INT NOT NULL,
    Title VARCHAR(200) NULL,
    Subtitle VARCHAR(200) NULL,
    Content TEXT NULL,
    PageId INT NOT NULL,
    CONSTRAINT page_section_createdbyUsersid_fkey FOREIGN KEY (CreatedByUsersId)
        REFERENCES Users(Id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT page_section_pageid_fkey FOREIGN KEY (PageId)
        REFERENCES Page(Id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX page_section_name_idx ON Page_Section(Name);
CREATE INDEX page_section_pageid_idx ON Page_Section(PageId);

