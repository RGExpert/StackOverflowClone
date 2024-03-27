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
    password  varchar(255) collate utf8mb4_bin not null,
    join_date datetime                         not null,
    constraint u_id
        unique (u_id),
    constraint user_app_role_null_fk
        foreign key (r_id) references role (r_id)
);

create table post_rating
(
    u_id      bigint unsigned auto_increment,
    post_type tinyint(1)      not null,
    post_id   bigint unsigned not null,
    rating    tinyint(1)      not null,
    primary key (u_id, post_type),
    constraint u_id
        unique (u_id),
    constraint post_rating_user_app_null_fk
        foreign key (u_id) references user_app (u_id),
    constraint check_rating
        check ((`rating` = -(1)) or (`rating` = 1)),
    constraint check_type
        check ((`post_type` >= 0) and (`post_type` <= 1))
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
        foreign key (q_id) references question (q_id),
    constraint question_tags_tag_null_fk
        foreign key (t_id) references tag (t_id)
);


insert into user_app (u_id, r_id, user_name, password, join_date) values (1, 1, 'Ionut', 'pass1', '2019-03-16 18:03:24');

insert into user_app (u_id, r_id, user_name, password, join_date) values (2, 1, 'Tom', 'Nu', '1942-03-16 19:23:41');

insert into user_app (u_id, r_id, user_name, password, join_date) values (3, 2, 'Adam', 'bigJ', '2024-03-25 00:15:19');

insert into question (q_id, u_id, title, creation_date, text, image_path) values (1, 1, 'Rage Art?', '2024-03-16 19:22:59', 'How do i Rage Art?', null);

insert into question (q_id, u_id, title, creation_date, text, image_path) values (2, 2, 'Hoi4 naval invade', '2024-03-25 00:16:33', 'I dont know how to naval invade pls help', null);

insert into answer (a_id, q_id, u_id, text, creation_date, image_path) values (1, 1, 1, 'df 1+2', '2024-03-16 19:40:35', null);

insert into answer (a_id, q_id, u_id, text, creation_date, image_path) values (2, 2, 3, 'No way nerd', '2024-03-26 11:52:50', null);

