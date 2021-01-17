CREATE TABLE users (
  uid INT,
  username VARCHAR(25) PRIMARY KEY,
  bio VARCHAR(100)
);


//CREATED TABLE
CREATE TABLE posts (
  postId BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(25) NOT NULL,
  title VARCHAR(30) NOT NULL,
  content VARCHAR NOT NULL,
  subreddit VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP NOT NULL
);

INSERT INTO posts (username,title,content,subreddit,createdAt) VALUES ('Joshua','Welcome to Devstagram','This si the forst poeeif grtngui eodijf goigtnor edio3fo34n giotgtign gg 3 4 t5  g tg e 3 45ggunronigoignignoigniotn geigono egin gg45 weegeg grgrt','All','2016-06-23')