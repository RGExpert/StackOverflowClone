create table role
(
    r_id      bigint unsigned not null
        primary key,
    role_name varchar(255)    null,
    constraint r_id
        unique (r_id)
);

create table tag
(
    t_id     bigint unsigned auto_increment
        primary key,
    tag_name varchar(255) not null,
    constraint t_id
        unique (t_id)
);

create table user_app
(
    u_id      bigint unsigned auto_increment
        primary key,
    r_id      bigint unsigned                  null,
    user_name varchar(255)                     not null,
    email     varchar(255)                     null,
    password  varchar(255) collate utf8mb4_bin not null,
    join_date datetime                         not null,
    banned    tinyint(1)                       null,
    constraint u_id
        unique (u_id),
    constraint user_app_role_null_fk
        foreign key (r_id) references role (r_id)
);

create table post_rating
(
    post_type bigint unsigned not null,
    rating    tinyint(1)      null,
    post_id   int             not null,
    u_id      bigint unsigned not null,
    primary key (post_type, u_id, post_id),
    constraint post_rating_user_app_null_fk
        foreign key (u_id) references user_app (u_id)
);

create table question
(
    q_id          bigint unsigned auto_increment
        primary key,
    u_id          bigint unsigned null,
    title         varchar(255)    not null,
    creation_date datetime        not null,
    text          varchar(2048)   not null,
    image_path    varchar(1024)   null,
    constraint q_id
        unique (q_id),
    constraint question_user_app_null_fk
        foreign key (u_id) references user_app (u_id)
            on delete set null
);

create table answer
(
    a_id          bigint unsigned auto_increment
        primary key,
    q_id          bigint unsigned not null,
    u_id          bigint unsigned null,
    text          varchar(2048)   not null,
    creation_date datetime        not null,
    image_path    varchar(1024)   null,
    constraint a_id
        unique (a_id),
    constraint a_id_2
        unique (a_id),
    constraint answer_question_null_fk
        foreign key (q_id) references question (q_id)
            on delete cascade,
    constraint answer_user_app_null_fk
        foreign key (u_id) references user_app (u_id)
            on delete set null
);

create table question_tags
(
    pt_id bigint unsigned auto_increment
        primary key,
    q_id  bigint unsigned not null,
    t_id  bigint unsigned not null,
    constraint pt_id
        unique (pt_id),
    constraint question_tags_question_null_fk
        foreign key (q_id) references question (q_id)
            on delete cascade,
    constraint question_tags_tag_null_fk
        foreign key (t_id) references tag (t_id)
            on update cascade
);

insert into stackoverflow.answer (a_id, q_id, u_id, text, creation_date, image_path) values (18, 91, 23, 'This is not a CS question', '2024-05-21 21:32:39', 'picard-facepalm.jpg');
insert into stackoverflow.answer (a_id, q_id, u_id, text, creation_date, image_path) values (19, 92, 23, 'What?', '2024-05-21 21:32:51', null);
insert into stackoverflow.answer (a_id, q_id, u_id, text, creation_date, image_path) values (20, 93, 23, 'WHY IS THERE A C++ TAG!?!??!?
DO MODERATORS EVEN EXIST ON THIS WEBSITE?!?!?', '2024-05-21 21:33:30', null);
insert into stackoverflow.answer (a_id, q_id, u_id, text, creation_date, image_path) values (21, 93, 4, 'Chill out broski @radug', '2024-05-21 21:34:33', 'jake.jpg');
insert into stackoverflow.answer (a_id, q_id, u_id, text, creation_date, image_path) values (22, 94, 23, 'Horrible pic', '2024-05-21 21:39:22', null);

insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, -1, 93, 4);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, -1, 94, 4);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, 0, 91, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, 0, 92, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, 0, 93, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (0, 0, 94, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (1, 0, 22, 4);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (1, 1, 18, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (1, 1, 20, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (1, 0, 21, 23);
insert into stackoverflow.post_rating (post_type, rating, post_id, u_id) values (1, 1, 22, 23);

insert into stackoverflow.question (q_id, u_id, title, creation_date, text, image_path) values (91, 18, 'Pacman', '2024-05-22 00:28:17', 'PACMAN!?!?!?!?', 'clusters.png');
insert into stackoverflow.question (q_id, u_id, title, creation_date, text, image_path) values (92, 18, 'OPCODE!??!', '2024-05-22 00:29:39', 'I love opcodes', 'Byte Format.drawio.png');
insert into stackoverflow.question (q_id, u_id, title, creation_date, text, image_path) values (93, 18, 'Favorite song?', '2024-05-22 00:31:09', 'What is your guys favorite song?', null);
insert into stackoverflow.question (q_id, u_id, title, creation_date, text, image_path) values (94, 4, 'Admin AMA', '2024-05-22 00:38:38', 'Im the admin AMA', 'coffe.jpeg');

insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (240, 91, 12);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (241, 91, 13);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (242, 92, 14);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (243, 92, 13);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (244, 93, 15);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (245, 93, 16);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (246, 94, 17);
insert into stackoverflow.question_tags (pt_id, q_id, t_id) values (247, 94, 18);

insert into stackoverflow.role (r_id, role_name) values (1, 'USER');
insert into stackoverflow.role (r_id, role_name) values (2, 'ADMIN');

insert into stackoverflow.tag (t_id, tag_name) values (12, 'Pacman');
insert into stackoverflow.tag (t_id, tag_name) values (13, 'Cool');
insert into stackoverflow.tag (t_id, tag_name) values (14, 'Opcodes');
insert into stackoverflow.tag (t_id, tag_name) values (15, 'C++');
insert into stackoverflow.tag (t_id, tag_name) values (16, 'Song');
insert into stackoverflow.tag (t_id, tag_name) values (17, 'AMA');
insert into stackoverflow.tag (t_id, tag_name) values (18, 'ADMIN POST');

insert into stackoverflow.user_app (u_id, r_id, user_name, email, password, join_date, banned) values (4, 2, 'test_admin', 'test@example.com', '$2a$12$BCkYQDYtsW2scpJaYuJrxuw3Zs6K90LpjJr4JvyAM8HxAa2Gs90.q', '2012-03-16 18:03:24', 0);
insert into stackoverflow.user_app (u_id, r_id, user_name, email, password, join_date, banned) values (18, 1, 'test2', 'test2@example.com', '$2a$10$BHtaxMv6EGj77/1SBuvPUuyYL5Uldz1pVW1GuwcoK6kNpemOl4gua', '2024-05-19 01:14:54', 0);
insert into stackoverflow.user_app (u_id, r_id, user_name, email, password, join_date, banned) values (19, 1, 'test3', 'test3@example.com', '$2a$10$f.zVLtR2dholDJcCN3uaJ.izQyF00U3dq4vvUEi7nY2CWb0pgPVAC', '2024-05-21 22:32:18', 1);
insert into stackoverflow.user_app (u_id, r_id, user_name, email, password, join_date, banned) values (23, 1, 'radug', 'fakeEmail@yahoo.com', '$2a$10$m.60Tewhlb5WCn.UBFTSc.yvCrAB5X7/dWGss8uaEcAaywmE0YwJq', '2024-05-21 23:25:37', 0);
